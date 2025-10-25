import { DashboardContent } from "@/components/dashboard"
import { createCaller } from "@/server/api/server-caller"
import { TimeInMs } from "./constants"

const DashboardPage = async () => {
  const caller = await createCaller()

  const startDate = new Date(Date.now() - TimeInMs.ONE_MONTH)
  const endDate = new Date()

  const [clientsData, productsData, salesSummary, dailySalesData] =
    await Promise.all([
      caller.clients.listAll(),
      caller.products.listAll(),
      caller.sales.getSummary({
        startDate,
        endDate,
      }),
      caller.sales.getDailySales({
        startDate,
        endDate,
      }),
    ])

  return (
    <main className="flex min-h-screen flex-col items-center justify-start w-full mb-20">
      <DashboardContent
        totalClients={clientsData.length}
        totalProducts={productsData.length}
        salesSummary={salesSummary}
        dailySalesData={dailySalesData}
      />
    </main>
  )
}

export default DashboardPage
