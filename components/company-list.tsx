"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Building } from "lucide-react"

interface CompanyListProps {
  companies: string[]
  selectedCompany: string | null
  onSelectCompany: (company: string) => void
}

export default function CompanyList({ companies, selectedCompany, onSelectCompany }: CompanyListProps) {
  return (
    <div className="h-full">
      <h2 className="text-xl font-semibold mb-4">Companies</h2>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-1">
          {companies.map((company) => (
            <Button
              key={company}
              variant={selectedCompany === company ? "default" : "ghost"}
              className="w-full justify-start text-left"
              onClick={() => onSelectCompany(company)}
            >
              <Building className="mr-2 h-4 w-4" />
              {company}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
