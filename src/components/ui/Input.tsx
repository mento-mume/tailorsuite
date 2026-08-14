import { useId } from 'react'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, className, id, ...rest }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text-primary">
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={`
          h-11 px-4 rounded-[10px] text-base
          border ${error ? 'border-danger' : 'border-[#E5E7EB]'}
          focus:outline-none focus:border-primary
          disabled:bg-gray-50 disabled:text-text-disabled disabled:cursor-not-allowed
          ${className ?? ''}
        `}
        {...rest}
      />

      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}