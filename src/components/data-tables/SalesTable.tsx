/**
 * SalesTable Component
 *
 * Client component wrapper for DataTable specifically for sales.
 * Handles column definitions and rendering logic.
 */

"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DataTable, Column } from "./DataTable"
import { BookOpen } from "lucide-react"
import { formatPrice } from "@/app/utils/formatPrice"
import { Card } from "@/components/ui/card"
import { TSaleSchema } from "@/server/api/routers/sales/schemas/validation"
import { Routes } from "@/app/constants"
interface SalesTableProps {
  sales: TSaleSchema[]
}

export const SalesTable = ({ sales }: SalesTableProps) => {
  const Buttons = (row: TSaleSchema) => (
    <div className="flex gap-2">
      <Link href={`${Routes.SALES}/${row.id}`}>
        <Button className="hover:bg-transparent" variant="ghost" size="icon">
          <BookOpen />
        </Button>
      </Link>
    </div>
  )

  const columns: Column<TSaleSchema>[] = [
    {
      key: "client",
      label: "Client",
      sortable: false,
      render: (row) => `${row.client.firstName} ${row.client.lastName}`,
    },
    {
      key: "totalAmount",
      label: "Total Amount",
      sortable: true,
      render: (row) => formatPrice(row.totalAmount),
    },
    {
      key: "saleItems",
      label: "Items",
      sortable: false,
      render: (row) => row.saleItems.length,
    },
    {
      key: "saleDate",
      label: "Sale Date",
      sortable: true,
      render: (row) => new Date(row.saleDate).toLocaleDateString("pt-BR"),
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      render: (row) => new Date(row.createdAt).toLocaleDateString("pt-BR"),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => Buttons(row),
    },
  ]

  return (
    <Card className="p-6">
      <DataTable
        data={sales}
        columns={columns}
        keyExtractor={(row) => row.id}
      />
    </Card>
  )
}
