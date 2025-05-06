"use client"

import { useMemo } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import type { CompanyData } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CompanyChartProps {
  data: CompanyData[]
  companyName: string
}

export default function CompanyChart({ data, companyName }: CompanyChartProps) {
  const chartData = useMemo(() => {
    console.log("Processing chart data for:", companyName, "with", data.length, "rows")

    return data
      .map((item) => {
        const parsedData = {
          date: item.date ? new Date(item.date).toLocaleDateString() : "Unknown",
          open: Number.parseFloat(item.open) || 0,
          high: Number.parseFloat(item.high) || 0,
          low: Number.parseFloat(item.low) || 0,
          close: Number.parseFloat(item.close) || 0,
          volume: Number.parseInt(item.volume) || 0,
        }

        return parsedData
      })
      .filter((item) => !isNaN(item.close))
  }, [data, companyName])

  const latestData = chartData[chartData.length - 1] || { close: 0, open: 0 }
  const firstData = chartData[0] || { close: 0 }
  const priceChange = latestData.close - firstData.close
  const priceChangePercent = (priceChange / firstData.close) * 100

  const averageVolume = useMemo(() => {
    if (chartData.length === 0) return 0
    const totalVolume = chartData.reduce((sum, item) => sum + item.volume, 0)
    return Math.round(totalVolume / chartData.length)
  }, [chartData])

  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-muted-foreground">No data available for {companyName}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{companyName}</h2>
        <p className="text-muted-foreground">Stock price history</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Latest Price</CardDescription>
            <CardTitle className="text-2xl">${latestData.close.toFixed(2)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-sm ${priceChange >= 0 ? "text-green-500" : "text-red-500"}`}>
              {priceChange >= 0 ? "↑" : "↓"} ${Math.abs(priceChange).toFixed(2)} ({priceChangePercent.toFixed(2)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Open Price</CardDescription>
            <CardTitle className="text-2xl">${latestData.open.toFixed(2)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Latest trading day</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Volume</CardDescription>
            <CardTitle className="text-2xl">{averageVolume.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Shares per day</p>
          </CardContent>
        </Card>
      </div>

      <div className="h-[400px]">
        <ChartContainer
          config={{
            price: {
              label: "Price",
              color: "hsl(var(--chart-1))",
            },
            volume: {
              label: "Volume",
              color: "hsl(var(--chart-2))",
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
              <YAxis
                yAxisId="left"
                orientation="left"
                domain={["auto", "auto"]}
                tickFormatter={(value) => `$${value}`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={["auto", "auto"]}
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="close"
                name="Close Price"
                stroke="var(--color-price)"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="volume"
                name="Volume"
                stroke="var(--color-volume)"
                dot={false}
                strokeWidth={1.5}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  )
}
