import { ListViewMode } from "./ListViewMode"

interface ClientsFilterProps {
  viewMode: "card" | "table"
}

export function ClientsFilter({ viewMode }: ClientsFilterProps) {
  return (
    <div className="mb-4 flex flex-row items-center justify-end gap-4">
      <ListViewMode viewMode={viewMode} href="/clients" />
    </div>
  )
}
