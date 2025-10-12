'use client'

import { trpc } from '@/lib/trpc'
import { BaseDelete } from './BaseDelete'

interface DeleteProductButtonProps {
  id: string
  name: string
}

export function DeleteProductButton({ id, name }: DeleteProductButtonProps) {
  const deleteMutation = trpc.products.delete.useMutation({
    onSuccess: () => {
      window.location.reload()
    },
    onError: (error) => {
      alert(error.message)
    },
  })

  return <BaseDelete id={id} name={name} deleteMutation={deleteMutation} />
}
