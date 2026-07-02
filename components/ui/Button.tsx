'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children?: ReactNode;
}

const SIZES: Record<Size, string> = {
  sm: 'h-8 px-3.5 text-[13px] rounded-[9px]',
  md: 'h-10 px-5 text-sm rounded-[11px]',
  lg: 'h-12 px-6 text-[15px] rounded-xl',
};

const VARIANTS: Record<Variant, string> = {
  primary:
    'font-semibold text-on-primary border border-primary/50 bg-[linear-gradient(160deg,#a6e2ff,#7dd3fc)] shadow-[0_8px_22px_-8px_rgba(125,211,252,0.5),inset_0_1px_0_rgba(255,255,255,0.5)] hover:-translate-y-px hover:shadow-[0_12px_30px_-8px_rgba(125,211,252,0.7),inset_0_1px_0_rgba(255,255,255,0.6)] active:translate-y-0',
  secondary:
    'font-medium text-[#cde0ee] bg-[rgba(38,51,77,0.6)] border border-primary/20 hover:border-primary/40 hover:text-white',
  ghost:
    'font-medium text-on-surface-variant bg-transparent border border-transparent hover:bg-primary/10 hover:text-on-surface',
  danger:
    'font-semibold text-[#ffd9d9] bg-error/15 border border-error/40 hover:bg-error/25',
};

export default function Button({
  variant = 'secondary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center gap-2 cursor-pointer transition-all duration-200',
        'focus-ring',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0',
        SIZES[size],
        VARIANTS[variant],
        loading ? 'cursor-wait' : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {loading && (
        <span
          aria-hidden
          className="h-3.5 w-3.5 rounded-full border-2 border-primary/30 border-t-primary"
          style={{ animation: 'tf-spin 0.7s linear infinite' }}
        />
      )}
      {children}
    </button>
  );
}
