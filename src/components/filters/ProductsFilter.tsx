import { ListViewMode } from "./components/ListViewMode"
import { InStockFilter } from "./components/InStockFilter"
import { SearchInput } from "./components/SearchInput"
import { Routes } from "@/app/routes"
interface ProductsFilterProps {
  inStockOnly: boolean
  viewMode: "card" | "table"
}

const href = Routes.PRODUCTS
export const ProductsFilter = ({
  inStockOnly,
  viewMode,
}: ProductsFilterProps) => {
  return (
    <div className="mb-4 flex flex-row items-center justify-between gap-4">
      <div className="flex flex-row items-center gap-4 w-full">
        <SearchInput placeholder="Search" href={href} />
        <InStockFilter inStockOnly={inStockOnly} href={href} />
      </div>
      <ListViewMode viewMode={viewMode} href={href} />
    </div>
  )
}
