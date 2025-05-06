"use client"

// Component that displays detailed statistics for a stock index
// Shows key metrics and historical data in a tabular format
import { useMemo } from "react"
import type { IndexData } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate, formatNumber } from "@/lib/utils"

interface IndexStatsProps {
  data: IndexData[]
  indexName: string
}

export default function IndexStats({ data, indexName }: IndexStatsProps) {
  // Sort data by date (most recent first) for display
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      return new Date(b.index_date).getTime() - new Date(a.index_date).getTime()
    })
  }, [data])

  // Get latest data point for summary metrics
  const latestData = sortedData[0] || {}

  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-muted-foreground">No data available for {indexName}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 h-full">
      <div>
        <h2 className="text-2xl font-bold">{indexName}</h2>
        <p className="text-muted-foreground">Detailed statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>P/E Ratio</CardDescription>
            <CardTitle className="text-2xl">
              {latestData.pe_ratio !== "NaN" ? Number.parseFloat(latestData.pe_ratio).toFixed(2) : "N/A"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Price to Earnings Ratio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>P/B Ratio</CardDescription>
            <CardTitle className="text-2xl">
              {latestData.pb_ratio !== "NaN" ? Number.parseFloat(latestData.pb_ratio).toFixed(2) : "N/A"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Price to Book Ratio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Dividend Yield</CardDescription>
            <CardTitle className="text-2xl">
              {latestData.div_yield !== "NaN" ? Number.parseFloat(latestData.div_yield).toFixed(2) + "%" : "N/A"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Annual dividend yield</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Open</TableHead>
              <TableHead>High</TableHead>
              <TableHead>Low</TableHead>
              <TableHead>Close</TableHead>
              <TableHead>Change</TableHead>
              <TableHead className="text-right">Volume</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.slice(0, 10).map((item, index) => (
              <TableRow key={index}>
                <TableCell>{formatDate(item.index_date)}</TableCell>
                <TableCell>
                  {item.open_index_value !== "NaN" ? formatNumber(Number.parseFloat(item.open_index_value)) : "N/A"}
                </TableCell>
                <TableCell>
                  {item.high_index_value !== "NaN" ? formatNumber(Number.parseFloat(item.high_index_value)) : "N/A"}
                </TableCell>
                <TableCell>
                  {item.low_index_value !== "NaN" ? formatNumber(Number.parseFloat(item.low_index_value)) : "N/A"}
                </TableCell>
                <TableCell>
                  {item.closing_index_value !== "NaN"
                    ? formatNumber(Number.parseFloat(item.closing_index_value))
                    : "N/A"}
                </TableCell>
                <TableCell className={Number.parseFloat(item.points_change) >= 0 ? "text-green-500" : "text-red-500"}>
                  {item.points_change !== "NaN"
                    ? `${Number.parseFloat(item.points_change) >= 0 ? "+" : ""}${Number.parseFloat(item.points_change).toFixed(2)} (${Number.parseFloat(item.change_percent).toFixed(2)}%)`
                    : "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  {item.volume !== "NaN" ? formatNumber(Number.parseFloat(item.volume)) : "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
