"use client"

import { Switch } from "@/components/ui/switch"
import { useRouter, useSearchParams } from "next/navigation"
import { ListViewMode } from "./ListViewMode"

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

  return (
    <div className="mb-4 flex flex-row items-center justify-between gap-4">
      <label className="flex items-center gap-2 text-sm text-secondary-foreground cursor-pointer">
        <Switch checked={inStockOnly} onCheckedChange={handleInStockChange} />
        Show in-stock products only
      </label>

      <ListViewMode viewMode={viewMode} href="/products" />
    </div>
  )
}
