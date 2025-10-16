/**
 * Edit Client Page
 *
 * Form to edit an existing client.
 */

"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ClientForm } from "@/components/forms"
import { trpc } from "@/lib/trpc"
import { brazilianStates } from "@/lib/validations"
import { Address } from "@prisma/client"
import { notFound } from "next/navigation"
import { Loading } from "@/components/loading/Loading"

export default function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const { id: clientId } = React.use(params)

  const { data: client, isLoading: isLoadingClient } =
    trpc.clients.getById.useQuery({
      id: clientId,
    })

  const updateMutation = trpc.clients.update.useMutation({
    onSuccess: () => {
      router.push("/clients")
    },
  })

  if (isLoadingClient) {
    return <Loading />
  }

  if (!client) {
    return notFound()
  }

  return (
    <>
      <div className="mx-auto max-w-2xl w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Edit Client</h1>
          <p className="mt-2 text-secondary-foreground">
            Update client information and addresses
          </p>
        </div>

        <ClientForm
          defaultValues={{
            firstName: client.firstName,
            lastName: client.lastName,
            email: client.email,
            cpf: client.cpf,
            socialMedia: client.socialMedia || undefined,
            addresses: client.addresses.map((addr: Address) => ({
              type: addr.type as "HOME" | "WORK",
              street: addr.street,
              number: addr.number,
              city: addr.city,
              state: addr.state as (typeof brazilianStates)[number],
              cep: addr.cep,
            })),
            id: client.id,
          }}
          onSubmit={(data) =>
            updateMutation.mutate({
              id: clientId,
              ...data,
            })
          }
          isLoading={updateMutation.isPending}
          error={updateMutation.error?.message}
        />
      </div>
    </>
  )
}
