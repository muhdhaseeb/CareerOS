import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold px-4 py-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantStyles =
    variant === 'primary'
      ? 'bg-[#279B37] hover:bg-[#228531] text-white focus:ring-[#279B37]'
      : 'bg-[#083859] hover:bg-[#062942] text-white focus:ring-[#083859]';

  return (
    <button className={`${baseStyles} ${variantStyles} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
