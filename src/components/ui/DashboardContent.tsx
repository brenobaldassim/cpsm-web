/**
 * Dashboard Content Component
 *
 * Client component for dashboard with interactive features.
 */

'use client'

import * as React from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { trpc } from '@/lib/trpc'

export function DashboardContent() {
  // Get summary data
  const { data: clientsData } = trpc.clients.list.useQuery({
    page: 1,
    limit: 1,
  })

  const { data: productsData } = trpc.products.list.useQuery({
    page: 1,
    limit: 1,
  })

  // Get sales summary for last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: salesSummary } = trpc.sales.getSummary.useQuery({
    startDate: thirtyDaysAgo,
    endDate: new Date(),
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
        <p className="mt-2 text-neutral-600">
          Welcome back! Here&apos;s an overview of your business.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Clients */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">
                Total Clients
              </p>
              <p className="mt-2 text-3xl font-bold text-neutral-900">
                {clientsData?.total ?? '-'}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
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
            </div>
          </div>
        </Card>

        {/* Total Products */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">
                Total Products
              </p>
              <p className="mt-2 text-3xl font-bold text-neutral-900">
                {productsData?.total ?? '-'}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
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
            </div>
          </div>
        </Card>

        {/* Sales (Last 30 Days) */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">
                Sales (30 days)
              </p>
              <p className="mt-2 text-3xl font-bold text-neutral-900">
                {salesSummary?.totalSales ?? '-'}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
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
            </div>
          </div>
        </Card>

        {/* Revenue (Last 30 Days) */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">
                Revenue (30 days)
              </p>
              <p className="mt-2 text-3xl font-bold text-neutral-900">
                {salesSummary?.totalRevenueInCents
                  ? `R$ ${(
                      salesSummary.totalRevenueInCents / 100
                    ).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : '-'}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
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
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6 hover:bg-neutral-50 transition-colors">
            <Link href="/clients" className="block">
              <h3 className="font-medium text-neutral-900">Manage Clients</h3>
              <p className="mt-1 text-sm text-neutral-600">
                View and manage your client list
              </p>
            </Link>
          </Card>
          <Card className="p-6 hover:bg-neutral-50 transition-colors">
            <Link href="/products" className="block">
              <h3 className="font-medium text-neutral-900">Manage Products</h3>
              <p className="mt-1 text-sm text-neutral-600">
                Update inventory and pricing
              </p>
            </Link>
          </Card>
          <Card className="p-6 hover:bg-neutral-50 transition-colors">
            <Link href="/sales" className="block">
              <h3 className="font-medium text-neutral-900">Create Sale</h3>
              <p className="mt-1 text-sm text-neutral-600">
                Record a new sales transaction
              </p>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
