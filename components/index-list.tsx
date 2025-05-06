"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { TrendingUp, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface IndexListProps {
  indices: string[];
  selectedIndex: string | null;
  onSelectIndex: (index: string) => void;
}

export default function IndexList({
  indices,
  selectedIndex,
  onSelectIndex,
}: IndexListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIndices = indices.filter((index) =>
    index.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Market Indices</h2>

      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search indices..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <ScrollArea className="flex-1 max-h-[calc(80vh-100px)] overflow-scroll">
        <div className="space-y-1">
          {filteredIndices.length > 0 ? (
            filteredIndices.map((index) => (
              <Button
                key={index}
                variant={selectedIndex === index ? "default" : "ghost"}
                className="w-full justify-start text-left"
                onClick={() => onSelectIndex(index)}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                <span className="truncate">{index}</span>
              </Button>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">
              No indices found
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
