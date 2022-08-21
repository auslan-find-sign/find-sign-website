import type { Topic } from "$lib/models/analytics"

export default async function clientRecordAnalytics (topic: Topic, fetch = globalThis.fetch): Promise<void> {
  const url = `/analytics/record?${new URLSearchParams([['topic', topic]])}`
  const response = await fetch(url, { method: 'POST', body: '' })
  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`)
  }
}