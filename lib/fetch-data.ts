import type { IndexData } from "@/types"

export async function fetchAndParseCSV(url: string): Promise<IndexData[]> {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`)
    }

    const csvText = await response.text()
    return parseCSV(csvText)
  } catch (error) {
    console.error("Error fetching CSV:", error)
    throw error
  }
}

function parseCSV(csvText: string): IndexData[] {
  const lines = csvText.split("\n")

  const headers = lines[0]
    .replace(/"/g, "")
    .split(",")
    .map((header) => header.trim())

  const data: IndexData[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const values: string[] = []
    let currentValue = ""
    let insideQuotes = false

    for (let j = 0; j < line.length; j++) {
      const char = line[j]

      if (char === '"') {
        insideQuotes = !insideQuotes
      } else if (char === "," && !insideQuotes) {
        values.push(currentValue.replace(/"/g, ""))
        currentValue = ""
      } else {
        currentValue += char
      }
    }

    values.push(currentValue.replace(/"/g, ""))

    if (values.length < headers.length) continue

    const row: Record<string, string> = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ""
    })

    data.push(row as unknown as IndexData)
  }

  return data
}
