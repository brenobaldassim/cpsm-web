import { DashboardContent } from '@/app/components/DashboardContent'
import { createCaller } from '@/server/api/server-caller'

export default async function DashboardPage() {
  // Fetch data server-side
  const api = await createCaller()

  // Fetch all dashboard data in parallel
  const [clientsData, productsData, salesSummary] = await Promise.all([
    api.clients.list({ page: 1, limit: 1 }),
    api.products.list({ page: 1, limit: 1 }),
    api.sales.getSummary({
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
