"use client";
import { useEffect, useState } from "react";
import IndexList from "./index-list";
import IndexChart from "./index-chart";
import IndexStats from "./index-stats";
import { fetchAndParseCSV } from "@/lib/fetch-data";
import type { IndexData } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MarketDashboardProps {
  csvUrl: string;
}

export default function MarketDashboard({ csvUrl }: MarketDashboardProps) {
  const [indices, setIndices] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<string | null>(null);
  const [indexData, setIndexData] = useState<IndexData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("Fetching data from:", csvUrl);
        const data = await fetchAndParseCSV(csvUrl);
        console.log("Data fetched:", data.length, "rows");

        if (data.length === 0) {
          setError("No data found in the CSV file.");
          setIsLoading(false);
          return;
        }

        const uniqueIndices = Array.from(
          new Set(data.map((item) => item.index_name))
        )
          .filter((name) => name)
          .sort();

        console.log("Unique indices:", uniqueIndices.length);
        setIndices(uniqueIndices);
        setIndexData(data);

        if (uniqueIndices.length > 0 && !selectedIndex) {
          setSelectedIndex(uniqueIndices[0]);
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(
          `Failed to load data: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
        setIsLoading(false);
      }
    };

    loadData();
  }, [csvUrl]);

  const handleIndexSelect = (index: string) => {
    setSelectedIndex(index);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  const filteredData = selectedIndex
    ? indexData.filter((item) => item.index_name === selectedIndex)
    : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 bg-muted/30 rounded-lg p-4 md:sticky md:top-16 h-fit">
        <IndexList
          indices={indices}
          selectedIndex={selectedIndex}
          onSelectIndex={handleIndexSelect}
        />
      </div>

      <div className="md:col-span-2 bg-muted/30 rounded-lg p-4 h-fit">
        {selectedIndex ? (
          <Tabs defaultValue="chart" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="chart">Chart</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>
            <TabsContent value="chart">
              <IndexChart data={filteredData} indexName={selectedIndex} />
            </TabsContent>
            <TabsContent value="stats">
              <IndexStats data={filteredData} indexName={selectedIndex} />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-muted-foreground">
              Select an index to view data
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
