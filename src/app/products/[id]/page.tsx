/**
 * Edit Product Page
 *
 * Form to edit an existing product.
 */

'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ProductForm } from '@/components/forms'
import { trpc } from '@/lib/trpc'

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const { id: productId } = React.use(params)

  const { data: product, isLoading: isLoadingProduct } =
    trpc.products.getById.useQuery({
      id: productId,
    })

  const updateMutation = trpc.products.update.useMutation({
    onSuccess: () => {
      router.push('/products')
    },
  })

  if (isLoadingProduct) {
    return (
      <>
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </>
    )
  }

  if (!product) {
    return (
      <>
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">Product not found</div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">Edit Product</h1>
          <p className="mt-2 text-neutral-600">Update product information</p>
        </div>

        <ProductForm
          defaultValues={product}
          onSubmit={(data) =>
            updateMutation.mutate({
              id: productId,
              ...data,
            })
          }
          isLoading={updateMutation.isLoading}
          error={updateMutation.error?.message}
        />
      </div>
    </>
  )
}
