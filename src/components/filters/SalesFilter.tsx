import { ListViewMode } from "./ListViewMode"
import { SearchInput } from "./SearchInput"

interface SalesFilterProps {
  viewMode: "card" | "table"
}

const href = "/sales"
export function SalesFilter({ viewMode }: SalesFilterProps) {
  return (
    <div className="mb-4 flex flex-row items-center justify-between gap-4">
      <SearchInput placeholder="Search" href={href} />
      <ListViewMode viewMode={viewMode} href={href} />
    </div>
  )
}
