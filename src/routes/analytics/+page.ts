import { listAnalyticsTopics } from "$lib/models/analytics"
import type { PageLoad } from "./$types"

export const load: PageLoad = async () => {
  return { topics: listAnalyticsTopics() }
}