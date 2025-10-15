import { DashboardContent } from "@/components/dashboard"
import { createCaller } from "@/server/api/server-caller"

export default async function DashboardPage() {
  const caller = await createCaller()

  const [clientsData, productsData, salesSummary] = await Promise.all([
    caller.clients.list({ page: 1, limit: 1 }),
    caller.products.list({ page: 1, limit: 1 }),
    caller.sales.getSummary({
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      endDate: new Date(),
    }),
  ])

  return (
    <main className="flex min-h-screen flex-col items-center justify-start">
      <div className="md:p-16 p-6">
        <h1 className="text-4xl font-bold text-primary">
          Client & Product Manager
        </h1>
        <p className="mt-4 text-lg text-primary">
          Sales and inventory management system
        </p>
      </div>
      <DashboardContent
        clientsData={clientsData}
        productsData={productsData}
        salesSummary={salesSummary}
      />
    </main>
  )
}
