"use client"

// Component for visualizing stock index price data with charts
// Displays historical price trends and key metrics
import { useMemo } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import type { IndexData } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate, formatNumber } from "@/lib/utils"

interface IndexChartProps {
  data: IndexData[]
  indexName: string
}

export default function IndexChart({ data, indexName }: IndexChartProps) {
  // Process and sort data for the chart display
  const chartData = useMemo(() => {
    const sortedData = [...data].sort((a, b) => {
      return new Date(a.index_date).getTime() - new Date(b.index_date).getTime()
    })

    return sortedData.map((item) => ({
      date: formatDate(item.index_date),
      open: Number.parseFloat(item.open_index_value) || 0,
      high: Number.parseFloat(item.high_index_value) || 0,
      low: Number.parseFloat(item.low_index_value) || 0,
      close: Number.parseFloat(item.closing_index_value) || 0,
      change: Number.parseFloat(item.points_change) || 0,
      changePercent: Number.parseFloat(item.change_percent) || 0,
    }))
  }, [data])

  // Calculate key metrics for display
  const latestData = chartData[chartData.length - 1] || { close: 0, open: 0, change: 0, changePercent: 0 }
  const firstData = chartData[0] || { close: 0 }
  const overallChange = latestData.close - firstData.close
  const highestValue = Math.max(...chartData.map((item) => item.high))
  const lowestValue = Math.min(...chartData.filter((item) => item.low > 0).map((item) => item.low))

  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-muted-foreground">No data available for {indexName}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 h-fit">
      <div>
        <h2 className="text-2xl font-bold">{indexName}</h2>
        <p className="text-muted-foreground">Historical price data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-fit">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Latest Close</CardDescription>
            <CardTitle className="text-2xl">{formatNumber(latestData.close)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-sm ${latestData.change >= 0 ? "text-green-500" : "text-red-500"}`}>
              {latestData.change >= 0 ? "↑" : "↓"} {Math.abs(latestData.change).toFixed(2)} (
              {latestData.changePercent.toFixed(2)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Period High</CardDescription>
            <CardTitle className="text-2xl">{formatNumber(highestValue)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Highest value in period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Period Low</CardDescription>
            <CardTitle className="text-2xl">{formatNumber(lowestValue)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Lowest value in period</p>
          </CardContent>
        </Card>
      </div>

      <div className="h-fit">
        <ChartContainer
          config={{
            price: {
              label: "Price",
              color: "hsl(var(--chart-1))",
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 50,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
              <YAxis domain={["auto", "auto"]} tickFormatter={(value) => formatNumber(value)} />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="close"
                name="Closing Value"
                stroke="var(--color-price)"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  )
}
