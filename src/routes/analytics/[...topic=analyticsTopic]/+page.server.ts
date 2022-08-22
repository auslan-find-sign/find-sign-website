import { chunk } from '$lib/functions/iters'
import { isValidAnalyticsTopic, readAnalyticsYear, type Topic } from '$lib/models/analytics'
import { decodeFilename } from '$lib/models/filename-codec'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad<{ topic: Topic, year: number, minutes: number[] }> = async ({ params, url }) => {
  const year = parseInt(url.searchParams.get('year') || `${(new Date).getUTCFullYear()}`, 10)
  const topic = params.topic
  if (isValidAnalyticsTopic(topic)) {
    const data = await readAnalyticsYear(topic, year)
    const days = chunk(data, 60 * 24).map(values => {
      return values.reduce((prev, curr) => prev + curr, 0)
    })
    return { topic, year, days }
  } else {
    return error(500, 'invalid topic')
  }
}