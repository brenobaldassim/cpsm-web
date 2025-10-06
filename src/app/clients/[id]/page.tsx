/**
 * Edit Client Page
 *
 * Form to edit an existing client.
 */

'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/layouts'
import { ClientForm } from '@/components/forms'
import { trpc } from '@/lib/trpc'

export default function EditClientPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const clientId = params.id

  const { data: client, isLoading: isLoadingClient } =
    trpc.clients.getById.useQuery({
      id: clientId,
    })

  const updateMutation = trpc.clients.update.useMutation({
    onSuccess: () => {
      router.push('/clients')
    },
  })

  if (isLoadingClient) {
    return (
      <>
        <Navigation />
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </>
    )
  }

  if (!client) {
    return (
      <>
        <Navigation />
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">Client not found</div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">Edit Client</h1>
          <p className="mt-2 text-neutral-600">
            Update client information and addresses
          </p>
        </div>

        <ClientForm
          defaultValues={{
            ...client,
            id: client.id,
          }}
          onSubmit={(data) =>
            updateMutation.mutate({
              id: clientId,
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
