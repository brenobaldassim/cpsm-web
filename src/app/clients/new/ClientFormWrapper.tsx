'use client'

import { useState } from 'react'
import { ClientForm } from '@/components/forms'

interface ClientFormWrapperProps {
  createClient: (data: any) => Promise<void>
}

export function ClientFormWrapper({ createClient }: ClientFormWrapperProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()

  async function handleSubmit(data: any) {
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
