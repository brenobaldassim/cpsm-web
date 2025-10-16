/**
 * FormField Component
 *
 * Reusable form field wrapper that integrates with React Hook Form.
 * Includes label, input, and error message display.
 */

import * as React from "react"
import { type FieldError, type UseFormRegisterReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export interface FormFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Field label */
  label: string
  /** React Hook Form registration object */
  registration: UseFormRegisterReturn
  /** Validation error from React Hook Form */
  error?: FieldError
  /** Optional helper text below the field */
  helperText?: string
  /** Make field full width (default: true) */
  fullWidth?: boolean
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  registration,
  error,
  helperText,
  fullWidth = true,
  className,
  ...props
}) => {
  const id = registration.name

  return (
    <div className={cn("space-y-2", fullWidth && "w-full")}>
      <Label htmlFor={id} className={error && "text-red-600"}>
        {label}
        {props.required && <span className="ml-1 text-red-500">*</span>}
      </Label>

      <Input
        id={id}
        {...registration}
        {...props}
        className={cn(
          error && "border-red-500 focus-visible:ring-red-500",
          className
        )}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={
          error ? `${id}-error` : helperText ? `${id}-helper` : undefined
        }
      />

      {error && (
        <p
          id={`${id}-error`}
          className="text-sm font-medium text-red-600"
          role="alert"
        >
          {error.message}
        </p>
      )}

      {helperText && !error && (
        <p id={`${id}-helper`} className="text-sm text-neutral-500">
          {helperText}
        </p>
      )}
    </div>
  )
}
