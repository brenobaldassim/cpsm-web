/**
 * Products List Page
 *
 * Display all products with search, filter, and pagination.
 * Protected route - requires authentication.
 */

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createCaller } from '@/server/api/server-caller'
import { ProductsFilter } from '@/components/filters/ProductsFilter'
import { ItemsListPagination } from '@/components/items-list-pagination'
import { ProductsListPageParams } from './types'
import { ProductsCardList } from '@/components/card-lists/productsCardList'
import { PackagePlus } from 'lucide-react'

interface ProductsListPageProps {
  searchParams: Promise<ProductsListPageParams>
}

export default async function ProductsListPage({
  searchParams,
}: ProductsListPageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const search = params.search || ''
  const inStockOnly = params.inStockOnly === 'true'
  const sortBy = params.sortBy || 'name'
  const sortOrder = params.sortOrder || 'asc'

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
          <Link href="/products/new">
            <Button className="[&_svg]:!size-7">
              <PackagePlus />
            </Button>
          </Link>
        </div>

        <ProductsFilter inStockOnly={inStockOnly} />
      </Card>

      <ProductsCardList data={data} />

      <ItemsListPagination
        page={page}
        totalPages={data.totalPages}
        params={params}
        href="/products"
      />
    </div>
  )
}
