import { CardButtonSection } from './CardItem'
import Link from 'next/link'
import { Button } from '../ui/button'
import { SquarePen } from 'lucide-react'
import { DeleteProductButton } from '../delete-buttons/DeleteProductButton'

interface CardButtonProps<T extends { id: string; name: string }> {
  row: T
  href: string
}

export const CardButtons = <T extends { id: string; name: string }>({
  row,
  href,
}: CardButtonProps<T>) => (
  <CardButtonSection>
    <Link href={`${href}/${row.id}`}>
      <Button variant="outline" size="sm">
        <SquarePen />
      </Button>
    </Link>
    <DeleteProductButton id={row.id} name={row.name} />
  </CardButtonSection>
)
