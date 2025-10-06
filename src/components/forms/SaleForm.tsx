/**
 * Sale Form Component
 *
 * Form for creating sales with multiple products.
 * Validates stock availability and calculates totals.
 */

'use client'

import * as React from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FormError, FormItem } from '@/components/forms'
import { trpc } from '@/lib/trpc'

const saleItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  quantity: z.number().int().positive('Quantity must be positive'),
})

const saleFormSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  saleDate: z.string(), // Will be converted to Date
  items: z.array(saleItemSchema).min(1, 'At least one product is required'),
})

type SaleFormData = z.infer<typeof saleFormSchema>

export interface SaleFormProps {
  onSubmit: (data: {
    clientId: string
    saleDate: Date
    items: { productId: string; quantity: number }[]
  }) => void
  isLoading?: boolean
  error?: string
}

export function SaleForm({
  onSubmit,
  isLoading = false,
  error,
}: SaleFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<SaleFormData>({
    resolver: zodResolver(saleFormSchema),
    defaultValues: {
      clientId: '',
      saleDate: new Date().toISOString().split('T')[0],
      items: [{ productId: '', quantity: 1 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  // Fetch clients and products
  const { data: clientsData } = trpc.clients.list.useQuery({
    page: 1,
    limit: 100,
  })
  const { data: productsData } = trpc.products.list.useQuery({
    page: 1,
    limit: 100,
  })

  const clients = clientsData?.clients || []
  const products = productsData?.products || []

  // Watch items to calculate total
  const watchedItems = watch('items')

  const calculateTotal = () => {
    let total = 0
    watchedItems.forEach((item) => {
      const product = products.find((p) => p.id === item.productId)
      if (product && item.quantity) {
        total += product.priceInCents * item.quantity
      }
    })
    return total
  }

  const formatPrice = (priceInCents: number) => {
    return `R$ ${(priceInCents / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  const handleFormSubmit = (data: SaleFormData) => {
    onSubmit({
      clientId: data.clientId,
      saleDate: new Date(data.saleDate),
      items: data.items,
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {error && <FormError message={error} />}

      {/* Basic Information */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
          Sale Information
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <FormItem>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Client <span className="text-red-500">*</span>
            </label>
            <select
              {...register('clientId')}
              className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm"
            >
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.firstName} {client.lastName}
                </option>
              ))}
            </select>
            {errors.clientId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.clientId.message}
              </p>
            )}
          </FormItem>

          <FormItem>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Sale Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register('saleDate')}
              className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm"
            />
            {errors.saleDate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.saleDate.message}
              </p>
            )}
          </FormItem>
        </div>
      </Card>

      {/* Products */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">Products</h2>
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ productId: '', quantity: 1 })}
          >
            Add Product
          </Button>
        </div>

        {errors.items && typeof errors.items.message === 'string' && (
          <FormError message={errors.items.message} />
        )}

        {fields.map((field, index) => (
          <Card key={field.id} className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-1 grid gap-4 sm:grid-cols-2">
                <FormItem>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Product <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register(`items.${index}.productId`)}
                    className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm"
                  >
                    <option value="">Select a product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {formatPrice(product.priceInCents)}{' '}
                        (Stock: {product.stockQty})
                      </option>
                    ))}
                  </select>
                  {errors.items?.[index]?.productId && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.items[index]?.productId?.message}
                    </p>
                  )}
                </FormItem>

                <FormItem>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    {...register(`items.${index}.quantity`, {
                      valueAsNumber: true,
                    })}
                    className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm"
                  />
                  {errors.items?.[index]?.quantity && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.items[index]?.quantity?.message}
                    </p>
                  )}
                </FormItem>
              </div>

              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => remove(index)}
                  className="mt-8"
                >
                  Remove
                </Button>
              )}
            </div>

            {/* Show line total */}
            {watchedItems[index]?.productId &&
              watchedItems[index]?.quantity && (
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Line Total:</span>
                    <span className="font-medium text-neutral-900">
                      {(() => {
                        const product = products.find(
                          (p) => p.id === watchedItems[index].productId
                        )
                        if (product) {
                          return formatPrice(
                            product.priceInCents * watchedItems[index].quantity
                          )
                        }
                        return '-'
                      })()}
                    </span>
                  </div>
                </div>
              )}
          </Card>
        ))}
      </div>

      {/* Total */}
      <Card className="p-6 bg-neutral-50">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-neutral-900">
            Total Amount:
          </span>
          <span className="text-2xl font-bold text-neutral-900">
            {formatPrice(calculateTotal())}
          </span>
        </div>
      </Card>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating Sale...' : 'Create Sale'}
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
