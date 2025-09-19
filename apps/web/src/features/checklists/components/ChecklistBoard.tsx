'use client';

import { useEffect, useState } from 'react';
import { Card } from '@community-app/ui';
import { useSession } from '@/lib/hooks/useSession';
import { captureClientEvent } from '@/lib/analytics/posthogClient';

type ChecklistItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'in_progress' | 'done';
};

export function ChecklistBoard() {
  const { email, loading } = useSession();
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [pending, setPending] = useState(false);
  const [updatingIds, setUpdatingIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!email || loading) {
      return;
    }

    async function fetchChecklist() {
      try {
        setPending(true);
        const res = await fetch('/api/checklists', { credentials: 'include' });
        if (!res.ok) {
          setItems([]);
          return;
        }
        const data = await res.json();
        setItems(data.checklist?.items ?? []);
        captureClientEvent('checklist_viewed', { count: data.checklist?.items?.length ?? 0 });
      } finally {
        setPending(false);
      }
    }

    void fetchChecklist();
  }, [email, loading]);

  if (loading) {
    return <p className="text-sm text-slate-500">세션을 확인하는 중입니다...</p>;
  }

  if (!email) {
    return <p className="text-sm text-slate-500">체크리스트를 보려면 먼저 이메일 인증을 완료하세요.</p>;
  }

  const toggleStatus = async (item: ChecklistItem) => {
    const nextStatus = item.status === 'done' ? 'pending' : 'done';
    setUpdatingIds((prev) => ({ ...prev, [item.id]: true }));
    setItems((prev) =>
      prev.map((entry) => (entry.id === item.id ? { ...entry, status: nextStatus } : entry))
    );

    try {
      const res = await fetch(`/api/checklists/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: nextStatus })
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }

      captureClientEvent('checklist_item_status_toggled', {
        itemId: item.id,
        status: nextStatus
      });
    } catch (error) {
      console.error('[ChecklistBoard] status update failed', error);
      setItems((prev) =>
        prev.map((entry) => (entry.id === item.id ? { ...entry, status: item.status } : entry))
      );
    } finally {
      setUpdatingIds((prev) => {
        const copy = { ...prev };
        delete copy[item.id];
        return copy;
      });
    }
  };

  const renderStatusBadge = (status: ChecklistItem['status']) => {
    const styleMap: Record<ChecklistItem['status'], string> = {
      pending: 'bg-slate-100 text-slate-700',
      in_progress: 'bg-amber-100 text-amber-700',
      done: 'bg-green-100 text-green-700'
    };
    const labelMap: Record<ChecklistItem['status'], string> = {
      pending: '미완료',
      in_progress: '진행 중',
      done: '완료'
    };

    return (
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${styleMap[status]}`}>
        {labelMap[status]}
      </span>
    );
  };

  return (
    <Card
      title="나의 체크리스트"
      description="온보딩 프로필을 기반으로 생성된 할 일을 추적하세요."
    >
      {pending ? (
        <p className="text-sm text-slate-500">체크리스트를 불러오는 중...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-slate-500">아직 생성된 체크리스트가 없습니다.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-600">{item.description}</p>
                </div>
                {renderStatusBadge(item.status)}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-600">
                  {item.category}
                </span>
                <button
                  type="button"
                  onClick={() => toggleStatus(item)}
                  disabled={Boolean(updatingIds[item.id])}
                  className="text-xs font-medium text-blue-600 underline disabled:text-slate-400"
                >
                  {item.status === 'done' ? '되돌리기' : '완료 처리'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
