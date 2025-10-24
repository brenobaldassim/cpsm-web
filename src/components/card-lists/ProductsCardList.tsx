import { CardItem } from "../card-item/CardItem"
import { formatPrice } from "@/app/utils/formatPrice"
import { cn } from "@/lib/utils"
import { type TListProductsOutput } from "@/server/api/routers/products/schemas/validation"
import { CardButtons } from "../card-item/CardButtons"
import { DeleteProductButton } from "../delete-buttons/DeleteProductButton"
import { BaseCardList } from "./BaseCardList"
import { Routes } from "@/app/routes"
interface ProductsCardListProps {
  data: TListProductsOutput
}

export const ProductsCardList = ({ data }: ProductsCardListProps) => {
  return (
    <BaseCardList emptyMessage="products" isEmpty={data.products.length === 0}>
      {data.products.map((product) => (
        <CardItem
          key={product.id}
          item={product}
          className={cn({
            "bg-destructive/10 border-foreground/5": product.stockQty === 0,
          })}
          ButtonSection={
            <CardButtons
              id={product.id}
              href={Routes.PRODUCTS}
              DeleteButton={
                <DeleteProductButton id={product.id} name={product.name} />
              }
            />
          }
        >
          <p>{formatPrice(product.priceInCents)}</p>
          <p
            className={cn("text-sm text-muted-foreground", {
              "text-destructive font-medium": product.stockQty === 0,
            })}
          >
            {product.stockQty} in stock
          </p>
        </CardItem>
      ))}
    </BaseCardList>
  )
}
