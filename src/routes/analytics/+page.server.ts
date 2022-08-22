import { listAnalyticsTopics } from "$lib/models/analytics"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async () => {
  return { topics: await listAnalyticsTopics() }
}