"use client"

import { trpc } from "@/lib/trpc"
import { BaseDelete } from "./BaseDelete"

interface DeleteClientButtonProps {
  id: string
  name: string
}

export function DeleteClientButton({ id, name }: DeleteClientButtonProps) {
  const deleteMutation = trpc.clients.delete.useMutation({
    onSuccess: () => {
      window.location.reload()
    },
    onError: (error) => {
      alert(error.message)
    },
  })
  return <BaseDelete id={id} name={name} deleteMutation={deleteMutation} />
}
