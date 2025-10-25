"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon, X } from "lucide-react"
import { DateRange } from "react-day-picker"
import { parseLocalDate } from "@/app/utils/parseLocalDate"

interface DateRangeFilterProps {
  href: string
}

export function DateRangeFilter({ href }: DateRangeFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const startDateFromUrl = useMemo(
    () => searchParams.get("startDate"),
    [searchParams]
  )
  const endDateFromUrl = useMemo(
    () => searchParams.get("endDate"),
    [searchParams]
  )

  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (startDateFromUrl && endDateFromUrl) {
      return {
        from: parseLocalDate(startDateFromUrl),
        to: parseLocalDate(endDateFromUrl),
      }
    }
    return
  })

  useEffect(() => {
    if (!dateRange?.from && !startDateFromUrl) return

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())

      if (dateRange?.from && dateRange?.to) {
        params.set("startDate", dateRange.from.toISOString().split("T")[0])
        params.set("endDate", dateRange.to.toISOString().split("T")[0])
      } else {
        params.delete("startDate")
        params.delete("endDate")
      }

      params.delete("page")

      router.push(`${href}?${params.toString()}`)
    }, 800)

    return () => clearTimeout(timer)
  }, [dateRange, searchParams, router, href, startDateFromUrl])

  const handleClearDates = () => {
    setDateRange(undefined)
  }

  const formatDateRange = () => {
    if (!dateRange?.from) return "Filter by date"
    if (!dateRange.to) return dateRange.from.toLocaleDateString()
    return `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
  }

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="justify-start text-left font-normal min-w-[240px] bg-transparent"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={1}
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>

      {dateRange?.from && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClearDates}
          className="h-10 w-10"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
