/**
 * Create Sale Page
 *
 * Form to create a new sale with multiple products.
 */

"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { SaleForm } from "@/components/forms"
import { trpc } from "@/lib/trpc"

export default function CreateSalePage() {
  const router = useRouter()
  const utils = trpc.useUtils()

  const createMutation = trpc.sales.create.useMutation({
    onSuccess: () => {
      utils.sales.list.invalidate()
      router.push("/sales")
    },
  })

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Create Sale</h1>
        <p className="mt-2 text-secondary-foreground">
          Record a new sales transaction
        </p>
      </div>

      <SaleForm
        onSubmit={(data) => createMutation.mutate(data)}
        isLoading={createMutation.isPending}
        error={createMutation.error?.message}
      />
    </div>
  )
}
