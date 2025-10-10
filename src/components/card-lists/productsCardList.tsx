import { CardButtonSection, CardItem } from '../card-item/CardItem'
import { formatPrice } from '@/app/utils/formatPrice'
import { cn } from '@/lib/utils'
import {
  type listProductsOutput,
  type productSchema,
} from '@/server/api/routers/products'
import { SquarePen } from 'lucide-react'
import { DeleteProductButton } from '../delete-buttons/DeleteProductButton'
import { Button } from '../ui/button'
import Link from 'next/link'
interface ProductsCardListProps {
  data: listProductsOutput
}

const Buttons = (row: productSchema) => (
  <CardButtonSection>
    <Link href={`/products/${row.id}`}>
      <Button variant="outline" size="sm">
        <SquarePen />
      </Button>
    </Link>
    <DeleteProductButton id={row.id} name={row.name} />
  </CardButtonSection>
)

export function ProductsCardList({ data }: ProductsCardListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {data.products.map((product) => (
        <CardItem
          key={product.id}
          item={product}
          className={cn({
            'bg-destructive/10 border-foreground/5': product.stockQty === 0,
          })}
          ButtonSection={Buttons(product)}
        >
          <p>{formatPrice(product.priceInCents)}</p>
          <p
            className={cn('text-sm text-muted-foreground', {
              'text-destructive font-medium': product.stockQty === 0,
            })}
          >
            {product.stockQty} in stock
          </p>
        </CardItem>
      ))}
    </div>
  )
}
