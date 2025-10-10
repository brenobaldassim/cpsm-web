/**
 * Products List Page
 *
 * Display all products with search, filter, and pagination.
 * Protected route - requires authentication.
 */

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ProductsCardList } from '@/components/card-lists/productsCardList'
import { createCaller } from '@/server/api/server-caller'
import { ProductsFilter } from '@/components/filters/ProductsFilter'

interface ProductsListPageProps {
  searchParams: {
    page?: string
    search?: string
    inStockOnly?: string
    sortBy?: 'name' | 'priceInCents' | 'stockQty' | 'createdAt'
    sortOrder?: 'asc' | 'desc'
  }
}

export default async function ProductsListPage({
  searchParams,
}: ProductsListPageProps) {
  const page = Number(searchParams.page) || 1
  const search = searchParams.search || ''
  const inStockOnly = searchParams.inStockOnly === 'true'
  const sortBy = searchParams.sortBy || 'name'
  const sortOrder = searchParams.sortOrder || 'asc'

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

          <ProductsFilter inStockOnly={inStockOnly} />
        </Card>
      </div>
      <ProductsCardList data={data} />
    </div>
  )
}
