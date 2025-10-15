/**
 * ProductsTable Component
 *
 * Client component wrapper for DataTable specifically for products.
 * Handles column definitions and rendering logic.
 */

"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DataTable, Column } from "./DataTable"
import { Product } from "@prisma/client"
import { SquarePen } from "lucide-react"
import { DeleteProductButton } from "@/components/delete-buttons/DeleteProductButton"
import { formatPrice } from "@/app/utils/formatPrice"
import { Card } from "@/components/ui/card"

interface ProductsTableProps {
  products: Product[]
}

export function ProductsTable({ products }: ProductsTableProps) {
  const Buttons = (row: Product) => (
    <div className="flex gap-2">
      <Link href={`/products/${row.id}`}>
        <Button variant="outline" size="sm">
          <SquarePen />
        </Button>
      </Link>
      <DeleteProductButton id={row.id} name={row.name} />
    </div>
  )

  const columns: Column<Product>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (row) => row.name,
    },
    {
      key: "priceInCents",
      label: "Price",
      sortable: true,
      render: (row) => formatPrice(row.priceInCents),
    },
    {
      key: "stockQty",
      label: "Stock",
      sortable: true,
      render: (row) => (
        <span className={row.stockQty === 0 ? "text-red-600 font-medium" : ""}>
          {row.stockQty}
        </span>
      ),
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
        data={products}
        columns={columns}
        keyExtractor={(row) => row.id}
      />
    </Card>
  )
}
