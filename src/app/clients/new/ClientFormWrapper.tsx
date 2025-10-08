'use client'

import { useState } from 'react'
import { ClientForm } from '@/components/forms'
import { createClientInput } from '@/server/api/routers/clients'
import { z } from 'zod'

interface ClientFormWrapperProps {
  createClient: (data: z.infer<typeof createClientInput>) => Promise<void>
}

export function ClientFormWrapper({ createClient }: ClientFormWrapperProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()

  async function handleSubmit(data: z.infer<typeof createClientInput>) {
    setIsLoading(true)
    setError(undefined)
    try {
      await createClient(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsLoading(false)
    }
  }

  return (
    <ClientForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />
  )
}
