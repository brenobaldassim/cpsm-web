/**
 * Dashboard Content Component
 *
 * Server component for dashboard - receives data as props for SSR.
 */

import { DashBoardCard } from './DashBoardCard'

type DashboardContentProps = {
  clientsData: {
    total: number
    clients: unknown[]
    page: number
    limit: number
    totalPages: number
  }
  productsData: {
    total: number
    products: unknown[]
    page: number
    limit: number
    totalPages: number
  }
  salesSummary: {
    startDate: Date
    endDate: Date
    totalSales: number
    totalRevenueInCents: number
    averageSaleInCents: number
    totalItemsSold: number
  }
}

export function DashboardContent({
  clientsData,
  productsData,
  salesSummary,
}: DashboardContentProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
        <p className="mt-2 text-neutral-600">
          Welcome back! Here&apos;s an overview of your business.
        </p>
      </div>

      {/* Summary Cards */}

      <div className="grid gap-2 md:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Clients */}
        <DashBoardCard
          title="Total Clients"
          value={clientsData.total.toString()}
          iconBgColor="bg-blue-100"
          icon={
            <svg
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          }
        />

        {/* Total Products */}
        <DashBoardCard
          title="Total Products"
          value={productsData.total.toString()}
          iconBgColor="bg-green-100"
          icon={
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          }
        />

        {/* Sales (Last 30 Days) */}
        <DashBoardCard
          title="Sales (30 days)"
          value={salesSummary.totalSales.toString()}
          iconBgColor="bg-purple-100"
          icon={
            <svg
              className="h-6 w-6 text-purple-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          }
        />

        {/* Revenue (Last 30 Days) */}
        <DashBoardCard
          title="Revenue (30 days)"
          value={`R$ ${(salesSummary.totalRevenueInCents / 100).toLocaleString(
            'pt-BR',
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}`}
          iconBgColor="bg-yellow-100"
          icon={
            <svg
              className="h-6 w-6 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
      </div>
    </div>
  )
}
