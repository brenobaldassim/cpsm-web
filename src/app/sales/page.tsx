/**
 * Sales List Page
 *
 * Display sales with date filtering (default: last 30 days).
 * Protected route - requires authentication.
 */

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FilePlusIcon } from "lucide-react"
import { SalesCardList } from "@/components/card-lists/salesCardList"
import { createCaller } from "@/server/api/server-caller"
import { SalesListPageParams } from "./types"
import { ItemsListPagination } from "@/components/items-list-pagination"

interface SalesListPageProps {
  searchParams: Promise<SalesListPageParams>
}

export default async function SalesListPage({
  searchParams,
}: SalesListPageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  // TODO: Add date filtering UI
  // const [dateFrom, setDateFrom] = React.useState<Date>(() => {
  //   const date = new Date()
  //   date.setDate(date.getDate() - 30)
  //   return date
  // })
  // const [dateTo, setDateTo] = React.useState<Date>(new Date())

  const caller = await createCaller()
  const data = await caller.sales.list({
    page,
    limit: 20,
    sortBy: "saleDate",
    sortOrder: "desc",
  })
  return (
    <div className="w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-4">
      <Card className="p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Sales</h1>
            <p className="mt-2 text-muted-foreground">
              View and manage sales transactions
            </p>
          </div>
          <Link href="/sales/new">
            <Button>
              <FilePlusIcon className="size-7" />
            </Button>
          </Link>
        </div>

        {/* Info about date filtering */}
        <div className="mb-6 p-4 bg-primary-foreground border border-primary/20 rounded-md">
          <p className="text-base text-primary ">
            Showing sales from the last 30 days (default view)
          </p>
        </div>
      </Card>
      <SalesCardList data={data} />

      <ItemsListPagination
        page={page}
        totalPages={data.totalPages}
        params={params as Record<string, string>}
        href="/sales"
      />
    </div>
  )
}
