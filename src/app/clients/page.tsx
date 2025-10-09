/**
 * Clients List Page
 *
 * Display all clients with search, sort, and pagination.
 * Protected route - requires authentication.
 */

'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DataTable, type Column } from '@/components/data-tables'
import { trpc } from '@/lib/trpc'

type Client = {
  id: string
  firstName: string
  lastName: string
  email: string
  cpf: string
  createdAt: Date
}

export default function ClientsListPage() {
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState('')
  const [sortBy, setSortBy] = React.useState<
    'firstName' | 'lastName' | 'email' | 'createdAt'
  >('lastName')
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc')

  const { data, isLoading } = trpc.clients.list.useQuery({
    page,
    limit: 20,
    search,
    sortBy,
    sortOrder,
  })

  const deleteMutation = trpc.clients.delete.useMutation({
    onSuccess: () => {
      // Refetch clients list
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

  const columns: Column<Client>[] = [
    {
      key: 'lastName',
      label: 'Name',
      sortable: true,
      render: (row) => `${row.firstName} ${row.lastName}`,
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (row) => row.email,
    },
    {
      key: 'cpf',
      label: 'CPF',
      render: (row) => row.cpf,
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
          <Link href={`/clients/${row.id}`}>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handleDelete(row.id, `${row.firstName} ${row.lastName}`)
            }
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
            <h1 className="text-3xl font-bold text-card-foreground">Clients</h1>
            <p className="mt-2 text-secondary-foreground">
              Manage your client database
            </p>
          </div>
          <Link href="/clients/new">
            <Button>Add Client</Button>
          </Link>
        </div>

        <DataTable
          data={data?.clients || []}
          columns={columns}
          searchPlaceholder="Search by name or email..."
          searchValue={search}
          onSearchChange={setSearch}
          currentPage={page}
          totalPages={data?.totalPages || 1}
          onPageChange={setPage}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          isLoading={isLoading}
          emptyMessage="No clients found"
          keyExtractor={(row) => row.id}
        />
      </div>
    </>
  )
}
