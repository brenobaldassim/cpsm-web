import { ListViewMode } from "./components/ListViewMode"
import { SearchInput } from "./components/SearchInput"
import { Routes } from "@/app/constants"
import { DateRangeFilter } from "./components/DateRangeFilter"
interface SalesFilterProps {
  viewMode: "card" | "table"
}

const href = Routes.SALES
export const SalesFilter = ({ viewMode }: SalesFilterProps) => {
  return (
    <div className="mb-4 flex flex-row items-center justify-between gap-4">
      <div className="flex flex-row items-center gap-4 w-full">
        <SearchInput placeholder="Search" href={href} />
        <DateRangeFilter href={href} />
      </div>
      <ListViewMode viewMode={viewMode} href={href} />
    </div>
  )
}
