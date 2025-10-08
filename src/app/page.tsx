import { DashboardContent } from '@/app/components/DashboardContent'

export default async function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="md:p-16 p-6">
        <h1 className="text-4xl font-bold">Client & Product Manager</h1>
        <p className="mt-4 text-lg text-gray-600">
          Sales and inventory management system
        </p>
      </div>
      <DashboardContent />
    </main>
  )
}
