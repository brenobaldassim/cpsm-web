/**
 * DataTable Component
 *
 * Reusable data table with pagination, sorting, and search.
 * Responsive design with mobile-friendly card layout.
 */

"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"

export interface Column<T> {
  /** Unique key for the column */
  key: string
  /** Column header label */
  label: string
  /** Render function for cell content */
  render: (row: T) => React.ReactNode
  /** Whether the column is sortable */
  sortable?: boolean
  /** CSS class for the column */
  className?: string
}

export interface DataTableProps<T> {
  /** Array of data to display */
  data: T[]
  /** Column definitions */
  columns: Column<T>[]
  /** Search placeholder text */
  searchPlaceholder?: string
  /** Search value (controlled) */
  searchValue?: string
  /** Search onChange handler */
  onSearchChange?: (value: string) => void
  /** Current page (1-indexed) */
  currentPage?: number
  /** Total number of pages */
  totalPages?: number
  /** Page change handler */
  onPageChange?: (page: number) => void
  /** Sort field */
  sortBy?: string
  /** Sort order */
  sortOrder?: "asc" | "desc"
  /** Sort change handler */
  onSortChange?: (field: string, order: "asc" | "desc") => void
  /** Loading state */
  isLoading?: boolean
  /** Empty state message */
  emptyMessage?: string
  /** Additional CSS classes */
  className?: string
  /** Key extractor function */
  keyExtractor: (row: T) => string | number
  /** Additional CSS classes for the table */
}

/**
 * DataTable Component
 *
 * @example
 * ```tsx
 * <DataTable
 *   data={clients}
 *   columns={[
 *     { key: 'name', label: 'Name', render: (row) => row.firstName },
 *     { key: 'email', label: 'Email', render: (row) => row.email },
 *   ]}
 *   keyExtractor={(row) => row.id}
 * />
 * ```
 */
export function DataTable<T>({
  data,
  columns,
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  sortBy,
  sortOrder = "asc",
  onSortChange,
  isLoading = false,
  emptyMessage = "No data found",
  className,
  keyExtractor,
}: DataTableProps<T>) {
  const handleSort = (columnKey: string) => {
    if (!onSortChange) return

    const newOrder =
      sortBy === columnKey && sortOrder === "asc" ? "desc" : "asc"
    onSortChange(columnKey, newOrder)
  }

  return (
    <div className={cn("space-y-4  border-muted", className)}>
      {/* Search bar */}
      {onSearchChange && (
        <div className="flex items-center gap-4">
          <Input
            placeholder={searchPlaceholder}
            value={searchValue || ""}
            onChange={(e) => onSearchChange(e.target.value)}
            className="max-w-sm"
          />
        </div>
      )}

      {/* Table */}
      <div className={cn("rounded-md border border-muted")}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    column.sortable && "cursor-pointer select-none",
                    column.className
                  )}
                  onClick={() =>
                    column.sortable && onSortChange && handleSort(column.key)
                  }
                >
                  <div className="flex items-center gap-2 text-card-foreground">
                    {column.label}
                    {column.sortable && sortBy === column.key && (
                      <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:last-child]:border-b-0 [&_tr]:text-muted-foreground">
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-card-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-card-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={keyExtractor(row)}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={cn(column.className, "text-card-foreground")}
                    >
                      {column.render(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground p-2">
            Page {currentPage} of {totalPages}
          </div>
          <Pagination className="justify-end w-fit mx-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(currentPage - 1)}
                  className={cn(
                    currentPage === 1 &&
                      "pointer-events-none opacity-50 cursor-not-allowed"
                  )}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange(currentPage + 1)}
                  className={cn(
                    currentPage === totalPages &&
                      "pointer-events-none opacity-50 cursor-not-allowed"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}

DataTable.displayName = "DataTable"
