import { DashboardContent } from '@/components/ui/DashboardContent'

export default async function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Client & Product Manager</h1>
      <p className="mt-4 text-lg text-gray-600">
        Sales and inventory management system
      </p>
      <DashboardContent />
    </main>
  )
}
