import { DashboardContent } from "@/components/dashboard"
import { createCaller } from "@/server/api/server-caller"
import { TimeInMs } from "./constants"

const DashboardPage = async () => {
  const caller = await createCaller()

  const [clientsData, productsData, salesSummary] = await Promise.all([
    caller.clients.listAll(),
    caller.products.listAll(),
    caller.sales.getSummary({
      startDate: new Date(Date.now() - TimeInMs.ONE_MONTH),
      endDate: new Date(),
    }),
  ])

  return (
    <main className="flex min-h-screen flex-col items-center justify-start w-full">
      <DashboardContent
        totalClients={clientsData.length}
        totalProducts={productsData.length}
        salesSummary={salesSummary}
      />
    </main>
  )
}

export default DashboardPage
