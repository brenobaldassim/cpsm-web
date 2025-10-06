/**
 * FormError Component
 *
 * Displays validation errors or general form errors.
 * Designed for React Hook Form integration.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface FormErrorProps {
  /** Error message to display */
  message?: string
  /** Additional CSS classes */
  className?: string
  /** Children (alternative to message prop) */
  children?: React.ReactNode
}

/**
 * FormError Component
 *
 * @example
 * ```tsx
 * <FormError message={errors.root?.message} />
 * ```
 */
export const FormError: React.FC<FormErrorProps> = ({
  message,
  className,
  children,
}) => {
  if (!message && !children) return null

  return (
    <div
      className={cn(
        'rounded-md border border-red-200 bg-red-50 p-4',
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        {/* Error icon */}
        <svg
          className="h-5 w-5 text-red-600 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>

        {/* Error message */}
        <div className="flex-1">
          <p className="text-sm font-medium text-red-800">
            {message || children}
          </p>
        </div>
      </div>
    </div>
  )
}

FormError.displayName = 'FormError'
