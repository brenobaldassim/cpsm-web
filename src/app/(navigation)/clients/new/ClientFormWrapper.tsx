"use client"

import { useState } from "react"
import { ClientForm } from "@/components/forms"
import { type TCreateClientInput } from "@/server/api/routers/clients/schemas/validation"

interface ClientFormWrapperProps {
  onSubmit: (data: TCreateClientInput) => void
}

export function ClientFormWrapper({ onSubmit }: ClientFormWrapperProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()

  async function handleSubmit(data: TCreateClientInput) {
    setIsLoading(true)
    setError(undefined)
    try {
      onSubmit(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setIsLoading(false)
    }
  }

  return (
    <ClientForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />
  )
}
