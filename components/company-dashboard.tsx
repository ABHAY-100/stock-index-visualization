"use client"

import { useEffect, useState } from "react"
import CompanyList from "./company-list"
import CompanyChart from "./company-chart"
import { fetchAndParseCSV } from "@/lib/fetch-data"
import type { CompanyData } from "@/types"

interface CompanyDashboardProps {
  csvUrl: string
}

export default function CompanyDashboard({ csvUrl }: CompanyDashboardProps) {
  const [companies, setCompanies] = useState<string[]>([])
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)
  const [companyData, setCompanyData] = useState<CompanyData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        console.log("Fetching data from:", csvUrl)
        const data = await fetchAndParseCSV(csvUrl)
        console.log("Data fetched:", data.length, "rows")

        if (data.length === 0) {
          setError("No data found in the CSV file.")
          setIsLoading(false)
          return
        }

        const uniqueCompanies = Array.from(new Set(data.map((item) => item.company)))
        console.log("Unique companies:", uniqueCompanies)

        setCompanies(uniqueCompanies)
        // @ts-ignore
        setCompanyData(data)

        if (uniqueCompanies.length > 0) {
          setSelectedCompany(uniqueCompanies[0])
        }

        setIsLoading(false)
      } catch (err) {
        console.error("Error loading data:", err)
        setError(`Failed to load data: ${err instanceof Error ? err.message : "Unknown error"}`)
        setIsLoading(false)
      }
    }

    loadData()
  }, [csvUrl])

  const handleCompanySelect = (company: string) => {
    setSelectedCompany(company)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    )
  }

  const filteredData = selectedCompany ? companyData.filter((item) => item.company === selectedCompany) : []

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 bg-muted/30 rounded-lg p-4">
        <CompanyList companies={companies} selectedCompany={selectedCompany} onSelectCompany={handleCompanySelect} />
      </div>
      <div className="md:col-span-2 bg-muted/30 rounded-lg p-4">
        {selectedCompany ? (
          <CompanyChart data={filteredData} companyName={selectedCompany} />
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-muted-foreground">Select a company to view data</p>
          </div>
        )}
      </div>
    </div>
  )
}
