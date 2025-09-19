import Link from 'next/link';

export default function AdminTemplatesPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">체크리스트 템플릿 관리</h1>
        <p className="mt-2 text-sm text-slate-600">
          학기/체류기간/언어별 체크리스트 템플릿을 검토하고 수정할 수 있는 관리 대시보드입니다.
        </p>
      </header>
      <section className="space-y-3">
        <p className="text-sm text-slate-600">
          API 엔드포인트 `/api/admin/templates`를 통해 템플릿 조회·수정이 가능하며, UI는 곧 추가될 예정입니다.
        </p>
        <Link
          href="https://github.com/HHSOLL/community-app/blob/main/infra/sql/seed_checklist_templates.sql"
          className="text-sm text-blue-600 underline"
        >
          초기 템플릿 시드 SQL 바로가기
        </Link>
      </section>
    </div>
  );
}
