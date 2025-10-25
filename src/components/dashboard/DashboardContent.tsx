/**
 * Dashboard Content Component
 *
 * Server component for dashboard - receives data as props for SSR.
 */

import { DashBoardCard } from "./DashBoardCard"
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react"

type DashboardContentProps = {
  totalClients: number
  totalProducts: number
  salesSummary: {
    startDate: Date
    endDate: Date
    totalSales: number
    totalRevenueInCents: number
    averageSaleInCents: number
    totalItemsSold: number
  }
}

export const DashboardContent = ({
  totalClients,
  totalProducts,
  salesSummary,
}: DashboardContentProps) => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-2 text-foreground">
          Welcome back! Here&apos;s an overview of your business.
        </p>
      </div>

      <div className="grid gap-2 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <DashBoardCard
          title="Total Clients"
          value={totalClients.toString()}
          iconBgColor="bg-muted "
          icon={<Users className="size-4 text-blue-600" />}
        />

        <DashBoardCard
          title="Total Products"
          value={totalProducts.toString()}
          iconBgColor="bg-muted"
          icon={<Package className="size-4 text-purple-600" />}
        />

        <DashBoardCard
          title="Sales (30 days)"
          value={salesSummary.totalSales.toString()}
          iconBgColor="bg-muted "
          icon={<ShoppingCart className="size-4 text-green-600" />}
        />

        <DashBoardCard
          title="Revenue (30 days)"
          value={`R$ ${(salesSummary.totalRevenueInCents / 100).toLocaleString(
            "pt-BR",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}`}
          iconBgColor="bg-muted "
          icon={<DollarSign className="size-4 text-yellow-600" />}
        />
      </div>
    </div>
  )
}
