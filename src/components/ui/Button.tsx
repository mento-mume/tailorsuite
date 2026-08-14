import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  icon?: ReactNode
  isLoading?: boolean
  children?: ReactNode
}

const baseClass =
  'rounded-[10px] h-11 px-5 inline-flex items-center justify-center font-semibold text-base transition-colors disabled:opacity-60 disabled:cursor-not-allowed'

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:brightness-90',
  secondary: 'bg-white text-primary border border-primary hover:bg-blue-50',
  danger: 'bg-danger text-white hover:brightness-90',
}

function Spinner() {
  return (
    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-current" />
  )
}

export default function Button({
  variant = 'primary',
  icon,
  isLoading,
  children,
  className,
  disabled,
  type,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type ?? 'button'}
      disabled={isLoading || disabled}
      className={`${baseClass} ${variantStyles[variant]} ${className ?? ''}`}
      {...rest}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  )
}