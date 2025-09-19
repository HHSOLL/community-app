import { ChecklistBoard } from '@/features/checklists/components/ChecklistBoard';

export default function ChecklistPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">나의 체크리스트</h1>
        <p className="mt-2 text-sm text-slate-600">
          온보딩 시 입력한 정보에 맞춰 생성된 할 일을 확인하고 진행 상황을 관리하세요.
        </p>
      </header>
      <ChecklistBoard />
    </div>
  );
}
