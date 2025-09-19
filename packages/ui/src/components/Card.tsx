import type { PropsWithChildren, ReactNode } from 'react';
import clsx from 'clsx';

type CardProps = PropsWithChildren<{
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}>;

export function Card({ title, description, actions, className, children }: CardProps) {
  return (
    <section className={clsx('rounded-xl border border-slate-200 bg-white p-6 shadow-sm', className)}>
      {(title || description || actions) && (
        <header className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
            {description && <p className="text-sm text-slate-600">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className="space-y-3 text-sm text-slate-700">{children}</div>
    </section>
  );
}
