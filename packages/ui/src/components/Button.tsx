import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
  }
>;

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline-blue-600',
  secondary:
    'bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:outline-slate-400',
  ghost:
    'bg-transparent text-blue-600 hover:bg-blue-50 focus-visible:outline-blue-200'
};

export function Button({ children, className, variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
