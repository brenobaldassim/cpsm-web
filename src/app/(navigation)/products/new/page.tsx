/**
 * Create Product Page
 *
 * Form to create a new product.
 */

"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ProductForm } from "@/components/forms"
import { trpc } from "@/lib/trpc"

export default function CreateProductPage() {
  const router = useRouter()
  const utils = trpc.useUtils()

  const createMutation = trpc.products.create.useMutation({
    onSuccess: () => {
      utils.products.list.invalidate()
      router.push("/products")
    },
  })

  return (
    <>
      <div className="w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Add Product</h1>
          <p className="mt-2 text-secondary-foreground">
            Create a new product with pricing and stock information
          </p>
        </div>

        <ProductForm
          onSubmit={(data) => createMutation.mutate(data)}
          isLoading={createMutation.isPending}
          error={createMutation.error?.message}
        />
      </div>
    </>
  )
}
