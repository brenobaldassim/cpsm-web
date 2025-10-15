import { CardItem } from "../card-item/CardItem"
import { formatPrice } from "@/app/utils/formatPrice"
import { cn } from "@/lib/utils"
import { type TListSalesOutput } from "@/server/api/routers/sales/schemas/validation"
import { Button } from "../ui/button"
import Link from "next/link"
import { BookOpen } from "lucide-react"

interface SalesCardListProps {
  data: TListSalesOutput
}

export function SalesCardList({ data }: SalesCardListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {data.sales.map((sale) => {
        const name = `${sale.client.firstName} ${sale.client.lastName}`
        return (
          <CardItem
            key={sale.id}
            item={{ ...sale, name }}
            className={cn({
              "bg-destructive/10 border-foreground/5": sale.totalAmount === 0,
            })}
            ButtonSection={
              <div className="absolute bottom-0 right-0 h-full flex items-end p-2">
                <Link className="group" href={`/sales/${sale.id}`}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-transparent"
                  >
                    <BookOpen className="group-hover:animate-bounce size-5" />
                  </Button>
                </Link>
              </div>
            }
          >
            <p className="text-sm text-muted-foreground">
              {formatPrice(sale.totalAmount)}
            </p>
          </CardItem>
        )
      })}
    </div>
  )
}
