/**
 * FormItem Component
 *
 * Wrapper component for form fields to provide consistent spacing and layout.
 * Use this to wrap form fields in a form.
 */

import * as React from "react"
import { cn } from "@/lib/utils"

export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Children form fields */
  children: React.ReactNode
  /** Additional CSS classes */
  className?: string
}

/**
 * FormItem Component
 *
 * @example
 * ```tsx
 * <form>
 *   <FormItem>
 *     <FormField label="Email" registration={register('email')} />
 *   </FormItem>
 *   <FormItem>
 *     <FormField label="Password" registration={register('password')} />
 *   </FormItem>
 * </form>
 * ```
 */
export const FormItem: React.FC<FormItemProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {children}
    </div>
  )
}

FormItem.displayName = "FormItem"
