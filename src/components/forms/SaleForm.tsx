/**
 * Sale Form Component
 *
 * Form for creating sales with multiple products.
 * Validates stock availability and calculates totals.
 */

"use client"

import * as React from "react"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FormError, FormItem } from "@/components/forms"
import { trpc } from "@/lib/trpc"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DateInput } from "@/components/ui/dateInput"
import { Input } from "../ui/input"
import { TCreateSaleInput } from "@/server/api/routers/sales/schemas/validation"

const saleItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.number().int().positive("Quantity must be positive"),
})

const saleFormSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  saleDate: z.string(), // Will be converted to Date
  items: z.array(saleItemSchema).min(1, "At least one product is required"),
})

export interface SaleFormProps {
  onSubmit: (data: TCreateSaleInput) => void
  isLoading?: boolean
  error?: string
}

export function SaleForm({
  onSubmit,
  isLoading = false,
  error,
}: SaleFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<TCreateSaleInput>({
    resolver: zodResolver(saleFormSchema),
    defaultValues: {
      clientId: "",
      saleDate: new Date(),
      items: [{ productId: "", quantity: 1 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  })

  // Fetch clients and products
  const { data: clientsData } = trpc.clients.list.useQuery({
    page: 1,
    limit: 100,
  })
  const { data: productsData } = trpc.products.list.useQuery({
    page: 1,
    limit: 100,
  })

  const clients = clientsData?.clients || []
  const products = productsData?.products || []

  // Watch items to calculate total
  const watchedItems = watch("items")

  const calculateTotal = () => {
    let total = 0
    watchedItems.forEach((item) => {
      const product = products.find((p) => p.id === item.productId)
      if (product && item.quantity) {
        total += product.priceInCents * item.quantity
      }
    })
    return total
  }

  const formatPrice = (priceInCents: number) => {
    return `R$ ${(priceInCents / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  const handleFormSubmit = (data: TCreateSaleInput) => {
    {
      onSubmit({
        clientId: data.clientId,
        saleDate: data.saleDate,
        items: data.items,
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {error && <FormError message={error} />}

      {/* Basic Information */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">
          Sale Information
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <FormItem>
            <label className="block text-sm font-medium  mb-2">
              Client <span className="text-red-500">*</span>
            </label>
            <Controller
              name="clientId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.firstName} {client.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.clientId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.clientId.message}
              </p>
            )}
          </FormItem>

          <FormItem>
            <label className="block text-sm font-medium mb-2">
              Sale Date <span className="text-red-500">*</span>
            </label>
            <Controller
              name="saleDate"
              control={control}
              render={({ field }) => (
                <DateInput
                  value={field.value?.toISOString()}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.saleDate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.saleDate.message}
              </p>
            )}
          </FormItem>
        </div>
      </Card>

      {/* Products */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Products</h2>
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ productId: "", quantity: 1 })}
            className="text-secondary-foreground"
          >
            Add Product
          </Button>
        </div>

        {errors.items && typeof errors.items.message === "string" && (
          <FormError message={errors.items.message} />
        )}

        {fields.map((field, index) => (
          <Card key={field.id} className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-1 grid gap-4 sm:grid-cols-2">
                <FormItem>
                  <label className="block text-sm font-medium mb-2">
                    Product <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name={`items.${index}.productId`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} -{" "}
                              {formatPrice(product.priceInCents)} (Stock:{" "}
                              {product.stockQty})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.items?.[index]?.productId && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.items[index]?.productId?.message}
                    </p>
                  )}
                </FormItem>

                <FormItem>
                  <label className="block text-sm font-medium mb-2">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    min="1"
                    {...register(`items.${index}.quantity`, {
                      valueAsNumber: true,
                    })}
                  />
                  {errors.items?.[index]?.quantity && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.items[index]?.quantity?.message}
                    </p>
                  )}
                </FormItem>
              </div>

              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => remove(index)}
                  className="mt-8"
                >
                  Remove
                </Button>
              )}
            </div>

            {/* Show line total */}
            {watchedItems[index]?.productId &&
              watchedItems[index]?.quantity && (
                <div className="mt-4 pt-4 border-t border-muted-foreground/20">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Line Total:</span>
                    <span className="font-medium text-primary">
                      {(() => {
                        const product = products.find(
                          (p) => p.id === watchedItems[index].productId
                        )
                        if (product) {
                          return formatPrice(
                            product.priceInCents * watchedItems[index].quantity
                          )
                        }
                        return "-"
                      })()}
                    </span>
                  </div>
                </div>
              )}
          </Card>
        ))}
      </div>

      {/* Total */}

      <Card className="p-6 bg-primary-foreground w-full">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-primary">
            Total Amount:
          </span>
          <span className="text-2xl font-bold text-primary">
            {formatPrice(calculateTotal())}
          </span>
        </div>
      </Card>

      {/* Submit Button */}

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating Sale..." : "Create Sale"}
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
