import { CardItem } from '../card-item/CardItem'
import { formatPrice } from '@/app/utils/formatPrice'
import { cn } from '@/lib/utils'

interface ProductsCardListProps {
  data:
    | {
        products: {
          name: string
          priceInCents: number
          stockQty: number
          createdAt: Date
          id: string
          updatedAt: Date
          createdBy: string
        }[]
        total: number
        page: number
        limit: number
        totalPages: number
      }
    | undefined
}

export function ProductsCardList({ data }: ProductsCardListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {data?.products.map((product) => (
        <CardItem
          key={product.id}
          item={product}
          className={cn({
            'bg-destructive/10 border-foreground/5': product.stockQty === 0,
          })}
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
