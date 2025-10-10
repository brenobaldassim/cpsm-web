'use client'

import { Button } from '@/components/ui/button'
import { trpc } from '@/lib/trpc'
import { Trash2 } from 'lucide-react'

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

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      deleteMutation.mutate({ id })
    }
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={deleteMutation.isPending}
    >
      <Trash2 />
    </Button>
  )
}
