/**
 * Clients List Page
 *
 * Display all clients with search, sort, and pagination.
 * Protected route - requires authentication.
 */

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PlusIcon } from "lucide-react"
import { ClientsCardList } from "@/components/card-lists/ClientsCardList"
import { ClientsTable } from "@/components/data-tables/ClientsTable"
import { ClientsFilter } from "@/components/filters/ClientsFilter"
import { createCaller } from "@/server/api/server-caller"
import { ClientsListPageParams } from "./types"
import { ItemsListPagination } from "@/components/items-list-pagination"
import { Routes } from "@/app/routes"

interface ClientsListPageProps {
  searchParams: Promise<ClientsListPageParams>
}

export default async function ClientsListPage({
  searchParams,
}: ClientsListPageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const search = params.search || ""
  const sortBy = params.sortBy || "lastName"
  const sortOrder = params.sortOrder || "asc"
  const viewMode = params.viewMode || "card"

  const caller = await createCaller()
  const data = await caller.clients.list({
    page,
    search,
    limit: 20,
    sortBy,
    sortOrder,
  })

  return (
    <div className="w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-4">
      <Card className="p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-card-foreground">Clients</h1>
            <p className="mt-2 text-muted-foreground">
              Manage your client database
            </p>
          </div>
          <Link href={`${Routes.CLIENTS}/new`}>
            <Button size="icon" variant="default">
              <PlusIcon className="size-7 text-primary-foreground" />
            </Button>
          </Link>
        </div>

        <ClientsFilter viewMode={viewMode} />
      </Card>

      {viewMode === "table" ? (
        <ClientsTable clients={data.clients} />
      ) : (
        <ClientsCardList data={data} />
      )}

      <ItemsListPagination
        page={page}
        totalPages={data.totalPages}
        params={params as Record<string, string>}
        href="/clients"
      />
    </div>
  )
}
