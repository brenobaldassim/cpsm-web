import { CardItem } from "../card-item/CardItem"
import { formatPrice } from "@/app/utils/formatPrice"
import { cn } from "@/lib/utils"
import { type TListSalesOutput } from "@/server/api/routers/sales/schemas/validation"
import { Button } from "../ui/button"
import Link from "next/link"
import { BookOpen } from "lucide-react"
import { BaseCardList } from "./BaseCardList"
import { Routes } from "@/app/routes"

interface SalesCardListProps {
  data: TListSalesOutput
}

export const SalesCardList = ({ data }: SalesCardListProps) => {
  return (
    <BaseCardList emptyMessage="sales" isEmpty={data.sales.length === 0}>
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
                <Link className="group" href={`${Routes.SALES}/${sale.id}`}>
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
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl  text-primary font-bold">
              {formatPrice(sale.totalAmount)}
            </p>
            <div className="flex flex-col justify-center items-end">
              <p className="text-sm text-muted-foreground">Total items</p>
              <p className="text-xl  text-primary font-bold">
                {sale.saleItems.length}
              </p>
            </div>
          </CardItem>
        )
      })}
    </BaseCardList>
  )
}
