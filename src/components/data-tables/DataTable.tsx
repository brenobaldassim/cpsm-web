/**
 * DataTable Component
 *
 * Reusable data table with pagination, sorting, and search.
 * Responsive design with mobile-friendly card layout.
 */

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

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
  sortOrder?: 'asc' | 'desc'
  /** Sort change handler */
  onSortChange?: (field: string, order: 'asc' | 'desc') => void
  /** Loading state */
  isLoading?: boolean
  /** Empty state message */
  emptyMessage?: string
  /** Additional CSS classes */
  className?: string
  /** Key extractor function */
  keyExtractor: (row: T) => string | number
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
  searchPlaceholder = 'Search...',
  searchValue,
  onSearchChange,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  sortBy,
  sortOrder = 'asc',
  onSortChange,
  isLoading = false,
  emptyMessage = 'No data found',
  className,
  keyExtractor,
}: DataTableProps<T>) {
  const handleSort = (columnKey: string) => {
    if (!onSortChange) return

    const newOrder =
      sortBy === columnKey && sortOrder === 'asc' ? 'desc' : 'asc'
    onSortChange(columnKey, newOrder)
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search bar */}
      {onSearchChange && (
        <div className="flex items-center gap-4">
          <Input
            placeholder={searchPlaceholder}
            value={searchValue || ''}
            onChange={(e) => onSearchChange(e.target.value)}
            className="max-w-sm"
          />
        </div>
      )}

      {/* Desktop table view */}
      <div className="hidden md:block rounded-md border border-neutral-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-100 border-b border-neutral-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 py-3 text-left text-sm font-medium text-neutral-700',
                    column.sortable && 'cursor-pointer hover:bg-neutral-200',
                    column.className
                  )}
                  onClick={() =>
                    column.sortable && onSortChange && handleSort(column.key)
                  }
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && sortBy === column.key && (
                      <span className="text-neutral-500">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-sm text-neutral-500"
                >
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-sm text-neutral-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  className="border-b border-neutral-200 last:border-b-0 hover:bg-neutral-50"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn('px-4 py-3 text-sm', column.className)}
                    >
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-sm text-neutral-500">
            Loading...
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-sm text-neutral-500">
            {emptyMessage}
          </div>
        ) : (
          data.map((row) => (
            <div
              key={keyExtractor(row)}
              className="rounded-md border border-neutral-200 p-4 space-y-2"
            >
              {columns.map((column) => (
                <div key={column.key} className="flex flex-col">
                  <span className="text-xs font-medium text-neutral-500">
                    {column.label}
                  </span>
                  <span className="text-sm">{column.render(row)}</span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-500">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

DataTable.displayName = 'DataTable'
