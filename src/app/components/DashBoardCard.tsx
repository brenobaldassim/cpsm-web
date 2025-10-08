import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

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
  iconBgColor = 'bg-green-100',
}) => {
  return (
    <Card>
      <CardHeader className="text-sm md:text-base">{title}</CardHeader>
      <CardContent>
        <CardTitle className="mt-2 text-xl md:text-2xl font-bold text-neutral-900 text-center md:text-left">
          {value ?? '-'}
        </CardTitle>

        <div className="w-full flex items-end justify-end mt-2">
          <div
            className={cn(
              `flex h-12 w-12 items-center justify-center rounded-full `,
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
