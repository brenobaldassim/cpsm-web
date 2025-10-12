import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination'
import { ProductsListPageParams } from '@/app/products/types'
import { returnParamsWithoutPage } from '@/app/utils/returnParamsWithoutPage'

interface ItemsListPaginationProps {
  page: number
  totalPages: number
  params?: ProductsListPageParams
  href: string
}

export function ItemsListPagination({
  page,
  totalPages,
  params,
  href,
}: ItemsListPaginationProps) {
  const paramsString = returnParamsWithoutPage(params)
  return (
    <Pagination>
      <PaginationContent>
        {page > 1 && (
          <PaginationItem>
            <PaginationPrevious
              href={`${href}?${paramsString}&page=${page - 1}`}
            />
          </PaginationItem>
        )}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              href={`${href}?${paramsString}&page=${p}`}
              isActive={p === page}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        {page < totalPages && (
          <PaginationItem>
            <PaginationNext href={`${href}?${paramsString}&page=${page + 1}`} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}
