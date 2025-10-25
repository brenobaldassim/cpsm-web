/**
 * Dashboard Content Component
 *
 * Server component for dashboard - receives data as props for SSR.
 */

import { DashBoardCard } from "./DashBoardCard"
import { SalesChart } from "./SalesChart"
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react"
import { formatPriceInCents } from "@/app/utils/formatPriceInCents"

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
  dailySalesData: Array<{
    date: string
    totalAmount: number
  }>
}

export const DashboardContent = ({
  totalClients,
  totalProducts,
  salesSummary,
  dailySalesData,
}: DashboardContentProps) => {
  return (
    <div className="w-full h-full max-w-9xl px-4 py-8 sm:px-6 lg:px-8 space-y-4 mb-10">
      <div className="w-full h-[180px] grid gap-2 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <DashBoardCard
          title="Total Revenue"
          titleSuffix="last 30 days"
          value={formatPriceInCents(salesSummary.totalRevenueInCents)}
          iconBgColor="bg-muted "
          icon={<DollarSign className="size-4 text-yellow-600" />}
        />

        <DashBoardCard
          title="Sales"
          titleSuffix="last 30 days"
          value={salesSummary.totalSales.toString()}
          iconBgColor="bg-muted "
          icon={<ShoppingCart className="size-4 text-green-600" />}
        />

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
        <div className="md:col-span-2 lg:col-span-4 ">
          <SalesChart data={dailySalesData} />
        </div>
      </div>
    </div>
  )
}
