import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface DashBoardCardProps {
  title: string
  titleSuffix?: string
  value: string
  icon: React.ReactNode
  iconBgColor?: string
}

export const DashBoardCard: React.FC<DashBoardCardProps> = ({
  title,
  value,
  icon,
  titleSuffix,
  iconBgColor = "bg-green-100",
}) => {
  return (
    <Card className="relative border border-muted-foreground/30">
      <CardHeader className="flex flex-row items-baseline gap-1 text-sm md:text-base pb-1">
        {title}
        <span className="text-xs text-muted-foreground">{titleSuffix}</span>
      </CardHeader>
      <CardContent>
        <CardTitle className="mt-0 text-2xl md:text-3xl font-bold text-card-foreground text-center md:text-left">
          {value ?? "-"}{" "}
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
