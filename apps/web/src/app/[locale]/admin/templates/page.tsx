'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/lib/hooks/useSession';
import { captureClientEvent } from '@/lib/analytics/posthogClient';

const locales = ['ko', 'en'] as const;

function TemplateForm() {
  const { email } = useSession();
  const [term, setTerm] = useState('2025-spring');
  const [stayLength, setStayLength] = useState(6);
  const [locale, setLocale] = useState<(typeof locales)[number]>('ko');
  const [items, setItems] = useState(
    Array.from({ length: 3 }).map(() => ({ title: '', description: '', category: '', position: 0 }))
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTemplate() {
      setLoading(true);
      setMessage(null);
      try {
        const params = new URLSearchParams({ term, stayLength: String(stayLength), locale });
        const res = await fetch(`/api/admin/templates?${params.toString()}`, { credentials: 'include' });
        if (!res.ok) {
          setMessage('템플릿을 불러오지 못했습니다. 관리자 권한을 확인하세요.');
          return;
        }
        const data = await res.json();
        if (data.template?.items?.length) {
          setItems(data.template.items);
        }
      } finally {
        setLoading(false);
      }
    }

    void fetchTemplate();
  }, [term, stayLength, locale]);

  const updateItem = (index: number, field: 'title' | 'description' | 'category', value: string) => {
    setItems((prev) => prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item)));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ term, stayLength, locale, items })
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message ?? '저장 실패');
      }
      setMessage('템플릿이 저장되었습니다.');
      captureClientEvent('admin_template_saved', { email, term, stayLength, locale });
    } catch (error) {
      console.error('[AdminTemplatesPage] save failed', error);
      setMessage('저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <label className="flex flex-col text-sm text-slate-600">
          학기(Term)
          <input
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            className="mt-1 rounded border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col text-sm text-slate-600">
          체류기간(개월)
          <input
            type="number"
            value={stayLength}
            min={1}
            max={24}
            onChange={(event) => setStayLength(Number(event.target.value))}
            className="mt-1 rounded border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col text-sm text-slate-600">
          언어(Locale)
          <select
            value={locale}
            onChange={(event) => setLocale(event.target.value as (typeof locales)[number])}
            className="mt-1 rounded border border-slate-300 px-3 py-2 text-sm"
          >
            {locales.map((code) => (
              <option key={code} value={code}>
                {code.toUpperCase()}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="rounded border border-slate-200 p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="flex flex-col text-xs text-slate-600">
                제목
                <input
                  value={item.title}
                  onChange={(event) => updateItem(index, 'title', event.target.value)}
                  className="mt-1 rounded border border-slate-300 px-3 py-2 text-sm"
                  placeholder="예: 통신 개통 준비"
                  required
                />
              </label>
              <label className="flex flex-col text-xs text-slate-600">
                카테고리
                <input
                  value={item.category}
                  onChange={(event) => updateItem(index, 'category', event.target.value)}
                  className="mt-1 rounded border border-slate-300 px-3 py-2 text-sm"
                  placeholder="예: 통신"
                  required
                />
              </label>
            </div>
            <label className="mt-3 flex flex-col text-xs text-slate-600">
              설명
              <textarea
                value={item.description}
                onChange={(event) => updateItem(index, 'description', event.target.value)}
                className="mt-1 rounded border border-slate-300 px-3 py-2 text-sm"
                rows={3}
              />
            </label>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-300"
        >
          {loading ? '저장 중...' : '템플릿 저장'}
        </button>
        {message && <p className="text-sm text-slate-600">{message}</p>}
      </div>
    </form>
  );
}

export default function AdminTemplatesPage() {
  const { email, loading } = useSession();

  if (loading) {
    return <p className="text-sm text-slate-500">세션을 확인하는 중입니다...</p>;
  }

  if (!email) {
    return <p className="text-sm text-slate-500">관리자 기능을 사용하려면 이메일 인증이 필요합니다.</p>;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">체크리스트 템플릿 관리</h1>
        <p className="mt-2 text-sm text-slate-600">
          학기/체류기간/언어별 템플릿을 불러오고 수정하여 체크리스트 추천 품질을 유지하세요.
        </p>
      </header>
      <TemplateForm />
      <p className="text-xs text-slate-500">
        * 템플릿 저장은 `ADMIN_EMAILS` 환경 변수에 등록된 계정만 허용됩니다.
      </p>
    </div>
  );
}
