import { mathWrite, readFile } from "$lib/data-io/data-io"

export type Topic = 'homepage' | 'search' | 'permalink' | 'random' | 'about' | 'technology'

export function isValidAnalyticsTopic (topic: string): topic is Topic {
  return ['homepage', 'search', 'permalink', 'random', 'about', 'technology'].includes(topic)
}

// log a hit to one of the analytics stores
export async function recordAnalytics (topic: Topic, value = 1) {
  const now = new Date()
  const year = now.getUTCFullYear()
  const yearStart = Date.UTC(year, 0, 1, 0, 0, 0, 0)
  const nextYearStart = Date.UTC(year + 1, 0, 1, 0, 0, 0, 0)
  const filename = `analytics/${year}/${topic}.u16`
  const minutesSinceYearStart = Math.floor((now.getTime() - yearStart) / 60_000)
  const bucketLength = Math.floor((nextYearStart - yearStart) / 60_000)

  await mathWrite(filename, bucketLength, 'u16', [
    {
      address: minutesSinceYearStart,
      operator: 'add',
      operand: value
    }
  ])
}

export async function readAnalytics (topic: Topic, startDate: Date, endDate: Date): Promise<Uint16Array> {
  const minutesInRange = Math.ceil((endDate.getTime() - startDate.getTime()) / 60_000)
  const results = new Uint16Array(minutesInRange)
  const valueSize = 2

  const requests = []
  for (let year = startDate.getUTCFullYear(); year <= endDate.getUTCFullYear(); year++) {
    const startYearMs = Date.UTC(year, 0, 1, 0, 0, 0, 0)
    const endYearMs = Date.UTC(year + 1, 0, 1, 0, 0, 0, 0) - 1
    requests.push((async () => {
      const filename = `analytics/${year}/${topic}.u16`
      const startFileDate = new Date(Math.max(startDate.getTime(), startYearMs))
      const endFileDate = new Date(Math.min(endDate.getTime(), endYearMs))
      const fileData = await readFile(filename)
      if (fileData) {
        const dataView = new DataView(fileData.buffer, fileData.byteOffset, fileData.byteLength)
        for (let minuteInYear = startFileDate.getTime() - (startYearMs * 60_000); minuteInYear < endFileDate.getTime() - (endYearMs * 60_000); minuteInYear++) {
          const value = dataView.getUint16(minuteInYear * valueSize, false)
          const date = startFileDate.getTime() + (minuteInYear * 60_000)
          const resultsOffset = Math.round((date - startDate.getTime()) / 60_000)
          results[resultsOffset] = value
        }
      }
    })())
  }
  await Promise.all(requests)

  return results
}