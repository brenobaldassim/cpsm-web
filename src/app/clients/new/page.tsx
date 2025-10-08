/**
 * Create Client Page
 *
 * Form to create a new client with addresses.
 */

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ClientForm } from '@/components/forms'
import { trpc } from '@/lib/trpc'

export default function CreateClientPage() {
  const router = useRouter()

  const createMutation = trpc.clients.create.useMutation({
    onSuccess: () => {
      router.push('/clients')
    },
  })

  type ClientFormData = Parameters<typeof createMutation.mutate>[0]

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">Add Client</h1>
          <p className="mt-2 text-neutral-600">
            Create a new client with contact and address information
          </p>
        </div>

        <ClientForm
          onSubmit={(data: ClientFormData) => createMutation.mutate(data)}
          isLoading={createMutation.isPending}
          error={createMutation.error?.message}
        />
      </div>
    </>
  )
}
