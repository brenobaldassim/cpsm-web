import { ListViewMode } from "./ListViewMode"
import { SearchInput } from "./SearchInput"

interface SalesFilterProps {
  viewMode: "card" | "table"
}

export function SalesFilter({ viewMode }: SalesFilterProps) {
  return (
    <div className="mb-4 flex flex-row items-center justify-between gap-4">
      <SearchInput placeholder="Search" href="/sales" />
      <ListViewMode viewMode={viewMode} href="/sales" />
    </div>
  )
}
