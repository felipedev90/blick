import { cn } from '@/lib/cn'

type ButtonVariant = 'primary' | 'icon' | 'ghost'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

const BASE_STYLES =
  'transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50 cursor-pointer '

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    'rounded-md bg-accent px-4 py-2 text-sm font-semibold text-bg hover:bg-accent/90 disabled:hover:bg-accent',
  icon: 'flex h-9 w-9 items-center justify-center rounded-full border border-border text-text hover:border-accent',
  ghost: 'text-left text-xs text-text-muted underline-offset-2 hover:text-text hover:underline',
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return <button className={cn(BASE_STYLES, VARIANT_STYLES[variant], className)} {...props} />
}
