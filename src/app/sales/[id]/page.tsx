/**
 * Sale Detail Page
 *
 * View complete sale information with items.
 */

"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { trpc } from "@/lib/trpc"

export default function SaleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: saleId } = React.use(params)

  const { data: sale, isLoading } = trpc.sales.getById.useQuery({
    id: saleId,
  })

  const formatPrice = (priceInCents: number) => {
    return `R$ ${(priceInCents / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  if (isLoading) {
    return (
      <>
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </>
    )
  }

  if (!sale) {
    return (
      <>
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">Sale not found</div>
        </div>
      </>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Sale Details</h1>
        <p className="mt-2 text-muted-foreground">
          View complete sale information
        </p>
      </div>

      {/* Sale Information */}
      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">
          Sale Information
        </h2>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">
              Sale Date
            </dt>
            <dd className="mt-1 text-sm text-card-foreground">
              {new Date(sale.saleDate).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">
              Client
            </dt>
            <dd className="mt-1 text-sm text-card-foreground">
              {sale.client.firstName} {sale.client.lastName}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">
              Total Amount
            </dt>
            <dd className="mt-1 text-lg font-semibold text-card-foreground">
              {formatPrice(sale.totalAmount)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">
              Created
            </dt>
            <dd className="mt-1 text-sm text-card-foreground">
              {new Date(sale.createdAt).toLocaleDateString("pt-BR")}
            </dd>
          </div>
        </dl>
      </Card>

      {/* Sale Items */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">
          Items
        </h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4">Product</TableHead>
              <TableHead className="px-4 text-right">Quantity</TableHead>
              <TableHead className="px-4 text-right">Unit Price</TableHead>
              <TableHead className="px-4 text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sale.saleItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="px-4 font-medium">
                  {item.product.name}
                </TableCell>
                <TableCell className="px-4 text-right">
                  {item.quantity}
                </TableCell>
                <TableCell className="px-4 text-right">
                  {formatPrice(item.priceInCents)}
                </TableCell>
                <TableCell className="px-4 text-right font-medium">
                  {formatPrice(item.priceInCents * item.quantity)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} className="px-4 text-right font-semibold">
                Total
              </TableCell>
              <TableCell className="px-4 text-right text-lg font-bold">
                {formatPrice(sale.totalAmount)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Card>
    </div>
  )
}
