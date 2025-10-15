import { ListViewMode } from "./ListViewMode"

interface SalesFilterProps {
  viewMode: "card" | "table"
}

export function SalesFilter({ viewMode }: SalesFilterProps) {
  return (
    <div className="mb-4 flex flex-row items-center justify-end gap-4">
      <ListViewMode viewMode={viewMode} href="/sales" />
    </div>
  )
}
