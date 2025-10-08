/**
 * Products List Page
 *
 * Display all products with search, filter, and pagination.
 * Protected route - requires authentication.
 */

'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DataTable, type Column } from '@/components/data-tables'
import { trpc } from '@/lib/trpc'

type Product = {
  id: string
  name: string
  priceInCents: number
  stockQty: number
  createdAt: Date
}

export default function ProductsListPage() {
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState('')
  const [inStockOnly, setInStockOnly] = React.useState(false)
  const [sortBy, setSortBy] = React.useState<
    'name' | 'priceInCents' | 'stockQty' | 'createdAt'
  >('name')
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc')

  const { data, isLoading } = trpc.products.list.useQuery({
    page,
    limit: 20,
    search,
    inStockOnly,
    sortBy,
    sortOrder,
  })

  const deleteMutation = trpc.products.delete.useMutation({
    onSuccess: () => {
      window.location.reload()
    },
    onError: (error) => {
      alert(error.message)
    },
  })

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      deleteMutation.mutate({ id })
    }
  }

  const handleSortChange = (field: string, order: 'asc' | 'desc') => {
    setSortBy(field as typeof sortBy)
    setSortOrder(order)
  }

  const formatPrice = (priceInCents: number) => {
    return `R$ ${(priceInCents / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  const columns: Column<Product>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (row) => row.name,
    },
    {
      key: 'priceInCents',
      label: 'Price',
      sortable: true,
      render: (row) => formatPrice(row.priceInCents),
    },
    {
      key: 'stockQty',
      label: 'Stock',
      sortable: true,
      render: (row) => (
        <span className={row.stockQty === 0 ? 'text-red-600 font-medium' : ''}>
          {row.stockQty}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (row) => new Date(row.createdAt).toLocaleDateString('pt-BR'),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Link href={`/products/${row.id}`}>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(row.id, row.name)}
            disabled={deleteMutation.isLoading}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Products</h1>
            <p className="mt-2 text-neutral-600">
              Manage your product catalog and inventory
            </p>
          </div>
          <Link href="/products/new">
            <Button>Add Product</Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded border-neutral-300"
            />
            Show in-stock products only
          </label>
        </div>

        <DataTable
          data={data?.products || []}
          columns={columns}
          searchPlaceholder="Search by product name..."
          searchValue={search}
          onSearchChange={setSearch}
          currentPage={page}
          totalPages={data?.totalPages || 1}
          onPageChange={setPage}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          isLoading={isLoading}
          emptyMessage="No products found"
          keyExtractor={(row) => row.id}
        />
      </div>
    </>
  )
}
