/**
 * Sale Detail Page
 *
 * View complete sale information with items.
 */

'use client'

import * as React from 'react'
import { Navigation } from '@/components/layouts'
import { Card } from '@/components/ui/card'
import { trpc } from '@/lib/trpc'

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
    return `R$ ${(priceInCents / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </>
    )
  }

  if (!sale) {
    return (
      <>
        <Navigation />
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">Sale not found</div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">Sale Details</h1>
          <p className="mt-2 text-neutral-600">
            View complete sale information
          </p>
        </div>

        {/* Sale Information */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Sale Information
          </h2>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-neutral-600">
                Sale Date
              </dt>
              <dd className="mt-1 text-sm text-neutral-900">
                {new Date(sale.saleDate).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-neutral-600">Client</dt>
              <dd className="mt-1 text-sm text-neutral-900">
                {sale.client.firstName} {sale.client.lastName}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-neutral-600">
                Total Amount
              </dt>
              <dd className="mt-1 text-lg font-semibold text-neutral-900">
                {formatPrice(sale.totalAmount)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-neutral-600">Created</dt>
              <dd className="mt-1 text-sm text-neutral-900">
                {new Date(sale.createdAt).toLocaleDateString('pt-BR')}
              </dd>
            </div>
          </dl>
        </Card>

        {/* Sale Items */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Items</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-neutral-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">
                    Product
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-neutral-700">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-neutral-700">
                    Unit Price
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-neutral-700">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {sale.saleItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-neutral-100 last:border-b-0"
                  >
                    <td className="px-4 py-3 text-sm text-neutral-900">
                      {item.product.name}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-neutral-900">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-neutral-900">
                      {formatPrice(item.priceInCents)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-neutral-900">
                      {formatPrice(item.priceInCents * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-neutral-200">
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-3 text-right text-sm font-semibold text-neutral-900"
                  >
                    Total
                  </td>
                  <td className="px-4 py-3 text-right text-lg font-bold text-neutral-900">
                    {formatPrice(sale.totalAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      </div>
    </>
  )
}
