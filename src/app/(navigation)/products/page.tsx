/**
 * Products List Page
 *
 * Display all products with search, filter, and pagination.
 * Protected route - requires authentication.
 */

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { createCaller } from "@/server/api/server-caller"
import { ProductsFilter } from "@/components/filters/ProductsFilter"
import { ItemsListPagination } from "@/components/items-list-pagination"
import { ProductsListPageParams } from "./types"
import { ProductsCardList } from "@/components/card-lists/ProductsCardList"
import { ProductsTable } from "@/components/data-tables/ProductsTable"
import { PackagePlus } from "lucide-react"
import { Routes } from "@/app/constants"

interface ProductsListPageProps {
  searchParams: Promise<ProductsListPageParams>
}

const ProductsListPage: React.FC<ProductsListPageProps> = async ({
  searchParams,
}) => {
  const params = await searchParams
  const page = Number(params.page) || 1
  const search = params.search || ""
  const inStockOnly = params.inStockOnly === "true"
  const sortBy = params.sortBy || "name"
  const sortOrder = params.sortOrder || "asc"
  const viewMode = params.viewMode || "card"

  const caller = await createCaller()
  const data = await caller.products.list({
    page,
    limit: 20,
    search,
    inStockOnly,
    sortBy,
    sortOrder,
  })

  return (
    <div className="w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-4">
      <Card className="p-6 ">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Products</h1>
            <p className="mt-2 text-muted-foreground">
              Manage your product catalog and inventory
            </p>
          </div>
          <Link href={`${Routes.PRODUCTS}/new`}>
            <Button size="icon" variant="default">
              <PackagePlus className="size-7 text-primary-foreground" />
            </Button>
          </Link>
        </div>

        <ProductsFilter inStockOnly={inStockOnly} viewMode={viewMode} />
      </Card>

      {viewMode === "table" ? (
        <ProductsTable products={data.products} />
      ) : (
        <ProductsCardList data={data} />
      )}

      <ItemsListPagination
        page={page}
        totalPages={data.totalPages}
        params={params as Record<string, string>}
        href="/products"
      />
    </div>
  )
}

export default ProductsListPage
