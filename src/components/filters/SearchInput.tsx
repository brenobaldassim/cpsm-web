"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "../ui/input"
import { useCallback, useEffect, useState } from "react"
import { SearchIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchInputProps {
  placeholder: string
  href: string
}

export function SearchInput({ placeholder, href }: SearchInputProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchFromUrl = searchParams.get("search") || ""
  const [search, setSearch] = useState<string>(searchFromUrl)
  const [isSearching, setIsSearching] = useState<boolean>(searchFromUrl !== "")

  const handleUpdateSearchParams = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (search) {
      params.set("search", search)
    } else {
      params.delete("search")
    }

    params.delete("page")

    router.push(`${href}?${params.toString()}`)
  }, [search, href, router, searchParams])

  useEffect(() => {
    setSearch(searchFromUrl)
  }, [searchFromUrl])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSearching(false)
      handleUpdateSearchParams()
    }, 500)
    return () => clearTimeout(timer)
  }, [search, handleUpdateSearchParams])

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value)
      setIsSearching(e.target.value !== "")
    },
    []
  )

  return (
    <div className="relative w-1/3">
      <Input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={handleSearchChange}
        className={cn("w-full", isSearching && "opacity-70")}
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2">
        <SearchIcon
          className={cn(
            "size-4 text-muted-foreground",
            isSearching && "opacity-70 animate-warning "
          )}
        />
      </div>
    </div>
  )
}
