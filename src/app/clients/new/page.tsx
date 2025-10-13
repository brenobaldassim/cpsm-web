/**
 * Create Client Page
 *
 * Form to create a new client with addresses.
 */

import * as React from 'react'
import { redirect } from 'next/navigation'
import { createCaller } from '@/server/api/server-caller'
import { ClientFormWrapper } from './ClientFormWrapper'
import { z } from 'zod'
import { createClientInput } from '@/server/api/routers/clients/router'

export default async function CreateClientPage() {
  async function createClient(data: z.infer<typeof createClientInput>) {
    'use server'
    const api = await createCaller()
    await api.clients.create(data)
    redirect('/clients')
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Add Client</h1>
        <p className="mt-2 text-secondary-foreground">
          Create a new client with contact and address information
        </p>
      </div>

      <ClientFormWrapper createClient={createClient} />
    </div>
  )
}
