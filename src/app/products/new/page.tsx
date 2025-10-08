/**
 * Create Product Page
 *
 * Form to create a new product.
 */

'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ProductForm } from '@/components/forms'
import { trpc } from '@/lib/trpc'

export default function CreateProductPage() {
  const router = useRouter()

  const createMutation = trpc.products.create.useMutation({
    onSuccess: () => {
      router.push('/products')
    },
  })

  return (
    <>
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">Add Product</h1>
          <p className="mt-2 text-neutral-600">
            Create a new product with pricing and stock information
          </p>
        </div>

        <ProductForm
          onSubmit={(data) => createMutation.mutate(data)}
          isLoading={createMutation.isLoading}
          error={createMutation.error?.message}
        />
      </div>
    </>
  )
}
