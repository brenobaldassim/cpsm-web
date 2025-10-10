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
import { Switch } from '@/components/ui/switch'
import { type Column } from '@/components/data-tables'
import { trpc } from '@/lib/trpc'
import { formatPrice } from '../utils/formatPrice'
import { Card } from '@/components/ui/card'
import { ProductsCardList } from '@/components/card-lists/productsCardList'

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
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(row.id, row.name)}
            disabled={deleteMutation.isPending}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-4">
      <div>
        <Card className="p-6 ">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Products</h1>
              <p className="mt-2 text-muted-foreground">
                Manage your product catalog and inventory
              </p>
            </div>
            <Link href="/products/new">
              <Button>Add Product</Button>
            </Link>
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm text-secondary-foreground cursor-pointer">
              <Switch checked={inStockOnly} onCheckedChange={setInStockOnly} />
              Show in-stock products only
            </label>
          </div>
        </Card>
      </div>
      <ProductsCardList data={data} />
    </div>
  )
}
