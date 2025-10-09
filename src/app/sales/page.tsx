/**
 * Sales List Page
 *
 * Display sales with date filtering (default: last 30 days).
 * Protected route - requires authentication.
 */

'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DataTable, type Column } from '@/components/data-tables'
import { trpc } from '@/lib/trpc'
import { formatPrice } from '../utils/formatPrice'

type Sale = {
  id: string
  client: {
    firstName: string
    lastName: string
  }
  saleDate: Date
  totalAmount: number
  createdAt: Date
}

export default function SalesListPage() {
  const [page, setPage] = React.useState(1)
  // TODO: Add date filtering UI
  // const [dateFrom, setDateFrom] = React.useState<Date>(() => {
  //   const date = new Date()
  //   date.setDate(date.getDate() - 30)
  //   return date
  // })
  // const [dateTo, setDateTo] = React.useState<Date>(new Date())

  const { data, isLoading } = trpc.sales.list.useQuery({
    page,
    limit: 20,
    sortBy: 'saleDate',
    sortOrder: 'desc',
  })

  const columns: Column<Sale>[] = [
    {
      key: 'saleDate',
      label: 'Date',
      render: (row) => new Date(row.saleDate).toLocaleDateString('pt-BR'),
    },
    {
      key: 'clientName',
      label: 'Client',
      render: (row) => `${row.client.firstName} ${row.client.lastName}`,
    },
    {
      key: 'totalAmount',
      label: 'Total',
      render: (row) => formatPrice(row.totalAmount),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <Link href={`/sales/${row.id}`}>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
      ),
    },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sales</h1>
          <p className="mt-2 text-secondary-foreground">
            View and manage sales transactions
          </p>
        </div>
        <Link href="/sales/new">
          <Button>Create Sale</Button>
        </Link>
      </div>

      {/* Info about date filtering */}
      <div className="mb-6 p-4 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-800">
          Showing sales from the last 30 days (default view)
        </p>
      </div>

      <DataTable
        data={data?.sales || []}
        columns={columns}
        currentPage={page}
        totalPages={data?.totalPages || 1}
        onPageChange={setPage}
        isLoading={isLoading}
        emptyMessage="No sales found for the selected period"
        keyExtractor={(row) => row.id}
      />
    </div>
  )
}
