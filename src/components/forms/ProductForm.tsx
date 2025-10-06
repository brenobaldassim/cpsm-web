/**
 * Product Form Component
 *
 * Form for creating and editing products.
 */

'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FormField, FormError, FormItem } from '@/components/forms'

const productFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  priceInCents: z.number().int().positive('Price must be positive'),
  stockQty: z.number().int().nonnegative('Stock cannot be negative'),
})

type ProductFormData = z.infer<typeof productFormSchema>

export interface ProductFormProps {
  defaultValues?: Partial<ProductFormData> & { id?: string }
  onSubmit: (data: ProductFormData) => void
  isLoading?: boolean
  error?: string
}

export function ProductForm({
  defaultValues,
  onSubmit,
  isLoading = false,
  error,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: defaultValues || {
      name: '',
      priceInCents: 0,
      stockQty: 0,
    },
  })

  // Convert price input (BRL) to cents for submission
  const handleFormSubmit = (data: ProductFormData) => {
    onSubmit({
      ...data,
      priceInCents: Math.round(data.priceInCents * 100),
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {error && <FormError message={error} />}

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
          Product Information
        </h2>
        <div className="space-y-6">
          <FormItem>
            <FormField
              label="Product Name"
              registration={register('name')}
              error={errors.name}
              placeholder="Enter product name"
              required
            />
          </FormItem>

          <FormItem>
            <FormField
              label="Price (R$)"
              type="number"
              step="0.01"
              registration={register('priceInCents', {
                valueAsNumber: true,
              })}
              error={errors.priceInCents}
              placeholder="0.00"
              helperText="Enter price in Brazilian Reais (e.g., 25.90)"
              required
            />
          </FormItem>

          <FormItem>
            <FormField
              label="Stock Quantity"
              type="number"
              registration={register('stockQty', {
                valueAsNumber: true,
              })}
              error={errors.stockQty}
              placeholder="0"
              helperText="Current inventory count"
              required
            />
          </FormItem>
        </div>
      </Card>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? 'Saving...'
            : defaultValues?.id
              ? 'Update Product'
              : 'Create Product'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
