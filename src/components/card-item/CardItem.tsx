import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Item } from "./types"
import { cn } from "@/lib/utils"

interface CardItemProps extends React.HTMLAttributes<HTMLDivElement> {
  item: Item
  children: React.ReactNode
  ButtonSection?: React.ReactNode
}

interface CardButtonSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const CardButtonSection: React.FC<CardButtonSectionProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <CardContent
      className={cn(
        "flex flex-col-reverse gap-2 justify-between absolute h-full p-2 top-0  right-0",
        className
      )}
      {...props}
    >
      {children}
    </CardContent>
  )
}

export const CardItem: React.FC<CardItemProps> = ({
  item,
  children,
  className,
  ButtonSection,
  ...props
}) => {
  return (
    <Card key={item.id} className={cn("relative", className)} {...props}>
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {ButtonSection}
      <CardFooter className="text-sm text-muted-foreground font-semibold">
        <p>{item.createdAt.toLocaleDateString("pt-BR")}</p>
      </CardFooter>
    </Card>
  )
}
