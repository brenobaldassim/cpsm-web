/**
 * Client Form Component
 *
 * Form for creating and editing clients with addresses.
 * Supports up to 2 addresses (HOME and WORK).
 */

'use client'

import * as React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FormField, FormError, FormItem } from '@/components/forms'
import { cpfSchema, cepSchema, brazilianStates } from '@/lib/validations'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const addressSchema = z.object({
  type: z.enum(['HOME', 'WORK']),
  street: z.string().min(1, 'Street is required').max(255),
  number: z.string().min(1, 'Number is required').max(20),
  city: z.string().min(1, 'City is required').max(100),
  state: z.enum(brazilianStates, {
    errorMap: () => ({ message: 'Invalid Brazilian state' }),
  }),
  cep: cepSchema,
})

const clientFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address'),
  cpf: cpfSchema,
  socialMedia: z.string().max(100).optional(),
  addresses: z
    .array(addressSchema)
    .min(1, 'At least one address is required')
    .max(2, 'Maximum 2 addresses allowed')
    .refine(
      (addresses) => {
        const types = addresses.map((a) => a.type)
        return types.length === new Set(types).size
      },
      { message: 'Cannot have duplicate address types' }
    ),
})

type ClientFormData = z.infer<typeof clientFormSchema>

export interface ClientFormProps {
  defaultValues?: Partial<ClientFormData> & { id?: string }
  onSubmit: (data: ClientFormData) => void
  isLoading?: boolean
  error?: string
}

export function ClientForm({
  defaultValues,
  onSubmit,
  isLoading = false,
  error,
}: ClientFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: defaultValues || {
      firstName: '',
      lastName: '',
      email: '',
      cpf: '',
      socialMedia: '',
      addresses: [
        {
          type: 'HOME',
          street: '',
          number: '',
          city: '',
          state: 'SP',
          cep: '',
        },
      ],
    },
  })

  const addresses = watch('addresses')

  const addAddress = () => {
    if (addresses.length < 2) {
      const newType = addresses[0]?.type === 'HOME' ? 'WORK' : 'HOME'
      setValue('addresses', [
        ...addresses,
        {
          type: newType as 'HOME' | 'WORK',
          street: '',
          number: '',
          city: '',
          state: 'SP',
          cep: '',
        },
      ])
    }
  }

  const removeAddress = (index: number) => {
    if (addresses.length > 1) {
      setValue(
        'addresses',
        addresses.filter((_, i) => i !== index)
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {error && <FormError message={error} />}

      {/* Basic Information */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Basic Information
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <FormItem>
            <FormField
              label="First Name"
              registration={register('firstName')}
              error={errors.firstName}
              required
            />
          </FormItem>

          <FormItem>
            <FormField
              label="Last Name"
              registration={register('lastName')}
              error={errors.lastName}
              required
            />
          </FormItem>

          <FormItem>
            <FormField
              label="Email"
              type="email"
              registration={register('email')}
              error={errors.email}
              required
            />
          </FormItem>

          <FormItem>
            <FormField
              label="CPF"
              registration={register('cpf')}
              error={errors.cpf}
              placeholder="000.000.000-00"
              helperText="Brazilian tax ID"
              required
            />
          </FormItem>

          <FormItem className="sm:col-span-2">
            <FormField
              label="Social Media"
              registration={register('socialMedia')}
              error={errors.socialMedia}
              placeholder="@username"
            />
          </FormItem>
        </div>
      </Card>

      {/* Addresses */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Addresses</h2>
          {addresses.length < 2 && (
            <Button type="button" variant="outline" onClick={addAddress}>
              Add Address
            </Button>
          )}
        </div>

        {errors.addresses && typeof errors.addresses.message === 'string' && (
          <FormError message={errors.addresses.message} />
        )}

        {addresses.map((_, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-foreground">
                {watch(`addresses.${index}.type`)} Address
              </h3>
              {addresses.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeAddress(index)}
                >
                  Remove
                </Button>
              )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <FormItem className="sm:col-span-2">
                <label className="text-sm font-medium">Address Type</label>
                <Controller
                  name={`addresses.${index}.type`}
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select address type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HOME">Home</SelectItem>
                        <SelectItem value="WORK">Work</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormItem>

              <FormItem className="sm:col-span-2">
                <FormField
                  label="Street"
                  registration={register(`addresses.${index}.street`)}
                  error={errors.addresses?.[index]?.street}
                  required
                />
              </FormItem>

              <FormItem>
                <FormField
                  label="Number"
                  registration={register(`addresses.${index}.number`)}
                  error={errors.addresses?.[index]?.number}
                  required
                />
              </FormItem>

              <FormItem>
                <FormField
                  label="City"
                  registration={register(`addresses.${index}.city`)}
                  error={errors.addresses?.[index]?.city}
                  required
                />
              </FormItem>

              <FormItem>
                <label className="text-sm font-medium">State</label>
                <Controller
                  name={`addresses.${index}.state`}
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {brazilianStates.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormItem>

              <FormItem>
                <FormField
                  label="CEP"
                  registration={register(`addresses.${index}.cep`)}
                  error={errors.addresses?.[index]?.cep}
                  placeholder="00000-000"
                  required
                />
              </FormItem>
            </div>
          </Card>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? 'Saving...'
            : defaultValues?.id
              ? 'Update Client'
              : 'Create Client'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
