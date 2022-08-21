import type { RequestHandler } from "./$types"
import { error } from "@sveltejs/kit"
import { isValidAnalyticsTopic, recordAnalytics } from "$lib/models/analytics"

export const POST: RequestHandler = async ({ url }) => {
  const topic = url.searchParams.get('topic')
  if (!isValidAnalyticsTopic(topic)) {
    return error(500, 'unsupported topic')
  }
  await recordAnalytics(topic, 1)
  return new Response('ok')
}