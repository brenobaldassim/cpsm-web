"use client"

import { formatPrice } from "@/app/utils/formatPrice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

type SalesChartProps = {
  data: Array<{
    date: string
    totalAmount: number
  }>
}

const chartConfig = {
  totalAmount: {
    label: "Total Amount",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function SalesChart({ data }: SalesChartProps) {
  // Format data for display
  const formattedData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    }),
    totalAmount: item.totalAmount,
    displayAmount: formatPrice(item.totalAmount),
  }))

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>
          Sales Revenue{" "}
          <span className="text-xs text-muted-foreground">last 30 days</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="md:h-[500px] w-full">
          <AreaChart
            data={formattedData}
            margin={{
              top: 15,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-totalAmount)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-totalAmount)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `R$ ${value}`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(value) => `Date: ${value}`}
                  formatter={(value) => [
                    formatPrice(Number(value)),
                    " Revenue",
                  ]}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="totalAmount"
              stroke="var(--color-totalAmount)"
              fill="url(#fillAmount)"
              fillOpacity={0.4}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
