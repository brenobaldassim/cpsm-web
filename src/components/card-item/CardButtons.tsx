import { CardButtonSection } from "./CardItem"
import Link from "next/link"
import { Button } from "../ui/button"
import { SquarePen } from "lucide-react"
interface CardButtonProps {
  id: string
  href: string
  DeleteButton: React.ReactNode
}

export const CardButtons: React.FC<CardButtonProps> = ({
  id,
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
