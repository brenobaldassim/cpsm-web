import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '../ui/button'
import { SquarePen } from 'lucide-react'
import { Trash2 } from 'lucide-react'
import { Item } from './types'
import { cn } from '@/lib/utils'

interface CardItemProps extends React.HTMLAttributes<HTMLDivElement> {
  item: Item
  children: React.ReactNode
}

export const CardItem: React.FC<CardItemProps> = ({
  item,
  children,
  className,
  ...props
}) => {
  return (
    <Card key={item.id} className={cn('relative', className)} {...props}>
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardContent className="flex gap-2 justify-end absolute bottom-0 right-0">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => console.log('click')}
        >
          <SquarePen />
        </Button>
        <Button variant="destructive" size="sm" onClick={() => {}}>
          <Trash2 />
        </Button>
      </CardContent>
      <CardFooter className="text-sm">
        <p>{item.createdAt.toLocaleDateString('pt-BR')}</p>
      </CardFooter>
    </Card>
  )
}
