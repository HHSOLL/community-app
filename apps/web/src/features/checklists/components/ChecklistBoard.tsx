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
              <p className="text-sm font-semibold text-slate-900">{item.title}</p>
              <p className="text-xs text-slate-600">{item.description}</p>
              <span className="mt-2 inline-flex rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-600">
                {item.category}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
