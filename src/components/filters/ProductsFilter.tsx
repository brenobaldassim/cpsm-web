"use client"

import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { LayoutGrid, Table } from "lucide-react"

interface ProductsFilterProps {
  inStockOnly: boolean
  viewMode: "card" | "table"
}

export function ProductsFilter({ inStockOnly, viewMode }: ProductsFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleInStockChange = (checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString())
    if (checked) {
      params.set("inStockOnly", "true")
    } else {
      params.delete("inStockOnly")
    }
    // Reset to page 1 when filter changes
    params.delete("page")
    router.push(`/products?${params.toString()}`)
  }

  const handleViewModeChange = (mode: "card" | "table") => {
    const params = new URLSearchParams(searchParams.toString())
    if (mode === "table") {
      params.set("viewMode", "table")
    } else {
      params.delete("viewMode") // card is the default
    }
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="mb-4 flex flex-row items-center justify-between gap-4">
      <label className="flex items-center gap-2 text-sm text-secondary-foreground cursor-pointer">
        <Switch checked={inStockOnly} onCheckedChange={handleInStockChange} />
        Show in-stock products only
      </label>

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
    </div>
  )
}
