/**
 * ClientsTable Component
 *
 * Client component wrapper for DataTable specifically for clients.
 * Handles column definitions and rendering logic.
 */

"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DataTable, Column } from "./DataTable"
import { SquarePen } from "lucide-react"
import { DeleteClientButton } from "@/components/delete-buttons/DeleteClientButton"
import { Card } from "@/components/ui/card"
import { TClientSchema } from "@/server/api/routers/clients/schemas/validation"
import { Routes } from "@/app/routes"
interface ClientsTableProps {
  clients: TClientSchema[]
}

export function ClientsTable({ clients }: ClientsTableProps) {
  const Buttons = (row: TClientSchema) => (
    <div className="flex gap-2">
      <Link href={`${Routes.CLIENTS}/${row.id}`}>
        <Button className="hover:bg-transparent" variant="ghost" size="icon">
          <SquarePen />
        </Button>
      </Link>
      <DeleteClientButton
        id={row.id}
        name={`${row.firstName} ${row.lastName}`}
      />
    </div>
  )

  const columns: Column<TClientSchema>[] = [
    {
      key: "firstName",
      label: "First Name",
      sortable: true,
      render: (row) => row.firstName,
    },
    {
      key: "lastName",
      label: "Last Name",
      sortable: true,
      render: (row) => row.lastName,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
      render: (row) => row.email,
    },
    {
      key: "cpf",
      label: "CPF",
      sortable: false,
      render: (row) => row.cpf,
    },
    {
      key: "address",
      label: "Address",
      sortable: false,
      render: (row) =>
        row.addresses[0]
          ? `${row.addresses[0].city}, ${row.addresses[0].state}`
          : "-",
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
        data={clients}
        columns={columns}
        keyExtractor={(row) => row.id}
      />
    </Card>
  )
}
