import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface DashBoardCardProps {
  title: string
  value: string
  icon: React.ReactNode
  iconBgColor?: string
}

export const DashBoardCard: React.FC<DashBoardCardProps> = ({
  title,
  value,
  icon,
  iconBgColor = "bg-green-100",
}) => {
  return (
    <Card className="relative border-muted">
      <CardHeader className="text-sm md:text-base">{title}</CardHeader>
      <CardContent>
        <CardTitle className="mt-2 text-xl md:text-2xl font-bold text-card-foreground text-center md:text-left">
          {value ?? "-"}
        </CardTitle>

        <div className="absolute top-2 right-2 ">
          <div
            className={cn(
              `flex size-8 items-center justify-center rounded-full `,
              iconBgColor
            )}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
