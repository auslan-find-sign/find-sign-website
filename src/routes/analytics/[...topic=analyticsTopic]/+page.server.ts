import { chunk, times } from '$lib/functions/iters'
import { isValidAnalyticsTopic, readAnalyticsYear, type Topic } from '$lib/models/analytics'
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

    const avgDay = chunk(data, 60 * 24).reduce((prev, curr) =>
      prev.map((val, index) => val + curr[index])
    ).map(value =>
      value / (data.length / (60 * 24))
    )

    const avgWeekMinutes = chunk(data, 60 * 24 * 7).reduce((prev, curr) =>
      prev.map((val, index) => val + curr[index])
    ).map(value =>
      value / (data.length / (60 * 24 * 7))
    )

    const avgWeek = chunk(avgWeekMinutes, 60).map(hourMins =>
      hourMins.reduce((prev, curr) => prev + curr)
    )

    // rotate week until starts on Sunday
    const firstMomentInYear = new Date(Date.UTC(year, 0))
    const firstDay = firstMomentInYear.getDay()
    if (firstDay !== 0) {
      avgWeek.push(...avgWeek.splice(0, firstDay * 24))
    }

    return { topic, year, days, avgDay, avgWeek }
  } else {
    return error(500, 'invalid topic')
  }
}