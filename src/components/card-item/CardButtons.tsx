import { CardButtonSection } from './CardItem'
import Link from 'next/link'
import { Button } from '../ui/button'
import { SquarePen } from 'lucide-react'
import { DeleteProductButton } from '../delete-buttons/DeleteProductButton'

interface CardButtonProps {
  id: string
  name: string
  href: string
  DeleteButton: React.ReactNode
}

export const CardButtons: React.FC<CardButtonProps> = ({
  id,
  name,
  href,
  DeleteButton,
}) => (
  <CardButtonSection>
    <Link href={`${href}/${id}`}>
      <Button variant="ghost" size="icon">
        <SquarePen />
      </Button>
    </Link>
    {DeleteButton}
  </CardButtonSection>
)
