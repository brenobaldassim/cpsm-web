"use client"

import { LayoutGrid, Table } from "lucide-react"
import { Button } from "../ui/button"
import { useRouter, useSearchParams } from "next/navigation"

interface ListViewModeProps {
  viewMode: "card" | "table"
  href: string
}

export function ListViewMode({ viewMode, href }: ListViewModeProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleViewModeChange = (mode: "card" | "table") => {
    const params = new URLSearchParams(searchParams.toString())
    if (mode === "table") {
      params.set("viewMode", "table")
    } else {
      params.delete("viewMode") // card is the default
    }
    router.push(`${href}?${params.toString()}`)
  }

  return (
    <div className="flex gap-1 border rounded-md p-1">
      <Button
        variant={viewMode === "card" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => handleViewModeChange("card")}
        className="h-8 px-3"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === "table" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => handleViewModeChange("table")}
        className="h-8 px-3"
      >
        <Table className="h-4 w-4" />
      </Button>
    </div>
  )
}
