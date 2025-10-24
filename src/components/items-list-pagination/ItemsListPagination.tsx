import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination"

import { updatePageInParams } from "@/app/utils/updatePageInParams"

interface ItemsListPaginationProps {
  page: number
  totalPages: number
  params?: Record<string, string>
  href: string
}

export const ItemsListPagination = ({
  page,
  totalPages,
  params,
  href,
}: ItemsListPaginationProps) => {
  return (
    <Pagination>
      <PaginationContent>
        {page > 1 && (
          <PaginationItem>
            <PaginationPrevious
              href={`${href}?${updatePageInParams(page - 1, params)}`}
            />
          </PaginationItem>
        )}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              href={`${href}?${updatePageInParams(p, params)}`}
              isActive={p === page}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        {page < totalPages && (
          <PaginationItem>
            <PaginationNext
              href={`${href}?${updatePageInParams(page + 1, params)}`}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}
