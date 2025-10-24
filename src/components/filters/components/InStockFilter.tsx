"use client"

import { Switch } from "@/components/ui/switch"
import { useRouter, useSearchParams } from "next/navigation"

interface InStockFilterProps {
  inStockOnly: boolean
  href: string
}

export const InStockFilter = ({ inStockOnly, href }: InStockFilterProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleInStockChange = (checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString())
    if (checked) {
      params.set("inStockOnly", "true")
    } else {
      params.delete("inStockOnly")
    }

    params.delete("page")
    router.push(`${href}?${params.toString()}`)
  }

  return (
    <label className="flex items-center gap-2 text-sm text-secondary-foreground cursor-pointer">
      <Switch checked={inStockOnly} onCheckedChange={handleInStockChange} />
      Show in-stock products only
    </label>
  )
}
