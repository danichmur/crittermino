import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'md' | 'lg'
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={cn(
      'inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold transition active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B9D] touch-manipulation',
      size === 'lg' ? 'min-h-14 px-6 text-lg' : 'min-h-11 px-4 text-base',
      variant === 'primary' && 'bg-[#FF6B9D] text-white shadow-[0_6px_0_#E84B7F] hover:brightness-105',
      variant === 'secondary' && 'bg-white text-[#3D2C29] shadow-sm ring-1 ring-[#E5D5C0] hover:bg-[#FFF9F0]',
      variant === 'ghost' && 'bg-transparent text-[#3D2C29] hover:bg-white/70',
      className,
    )}
    {...props}
  />
)
