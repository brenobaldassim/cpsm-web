'use client'

import { Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { type UseMutationResult } from '@tanstack/react-query'
import { AlertConfirmation } from '../alerts/AlertConfirmation'

interface BaseDeleteProps<TError = Error> {
  id: string
  name: string
  deleteMutation: UseMutationResult<
    { success: boolean },
    TError,
    { id: string }
  >
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
}

export const BaseDelete = <TError = Error,>({
  id,
  name,
  deleteMutation,
  title,
  description,
  confirmText = 'Delete',
  cancelText = 'Cancel',
}: BaseDeleteProps<TError>) => {
  const handleDelete = () => {
    deleteMutation.mutate({ id })
  }

  return (
    <AlertConfirmation
      trigger={
        <Button
          className="bg-destructive/20 text-destructive hover:text-destructive-foreground"
          variant="destructive"
          size="icon"
          disabled={deleteMutation.isPending}
        >
          <Trash2 />
        </Button>
      }
      title={title || `Delete ${name}?`}
      description={
        description ||
        `Are you sure you want to delete "${name}"? This action cannot be undone.`
      }
      confirmText={confirmText}
      cancelText={cancelText}
      onConfirm={handleDelete}
      variant="destructive"
    />
  )
}
