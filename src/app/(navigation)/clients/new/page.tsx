/**
 * Create Client Page
 *
 * Form to create a new client with addresses.
 */

"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ClientFormWrapper } from "./ClientFormWrapper"
import { trpc } from "@/lib/trpc"

const CreateClientPage = () => {
  const router = useRouter()
  const utils = trpc.useUtils()

  const createMutation = trpc.clients.create.useMutation({
    onSuccess: () => {
      utils.clients.list.invalidate()
      router.push("/clients")
    },
  })

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Add Client</h1>
        <p className="mt-2 text-secondary-foreground">
          Create a new client with contact and address information
        </p>
      </div>

      <ClientFormWrapper onSubmit={(data) => createMutation.mutate(data)} />
    </div>
  )
}

export default CreateClientPage
