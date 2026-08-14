import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  children: ReactNode
}
export default function Card({ title, children, className, ...rest }: CardProps) {
    return (
      <div
        className={`bg-white rounded-xl shadow-[0px_1px_3px_rgba(0,0,0,0.08)] p-6 ${className ?? ''}`}
        {...rest}
      >
        {title && (
          <h3 className="text-base font-semibold text-text-primary mb-4">
            {title}
          </h3>
        )}
        {children}
      </div>
    )
  }