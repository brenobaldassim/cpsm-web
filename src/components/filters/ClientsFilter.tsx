import { Routes } from "@/app/routes"
import { ListViewMode } from "./components/ListViewMode"
import { SearchInput } from "./components/SearchInput"

interface ClientsFilterProps {
  viewMode: "card" | "table"
}

const href = Routes.CLIENTS
export const ClientsFilter = ({ viewMode }: ClientsFilterProps) => {
  return (
    <div className="mb-4 flex flex-row items-center justify-between gap-4">
      <SearchInput placeholder="Search" href={href} />
      <ListViewMode viewMode={viewMode} href={href} />
    </div>
  )
}
