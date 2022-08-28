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

    const daysWithData = chunk(data, 60 * 24).filter(block =>
      block.some(x => x !== 0)
    )

    const avgDayMinutes = [...daysWithData.reduce((prev, curr) =>
      prev.map((val, index) => val + curr[index])
    )].map(value =>
      value / daysWithData.length
    )

    // in 5 min blocks
    const avgDay = chunk(avgDayMinutes, 5).map(block =>
      block.reduce((prev, curr) => prev + curr, 0)
    )

    const yearStart = new Date(Date.UTC(year, 0))
    const mondayOffset = ((9 - yearStart.getDay()) % 7) * 60 * 24
    const weeksWithData = chunk(data.slice(mondayOffset), 60 * 24 * 7).filter(block =>
      block.some(x => x !== 0)
    )
    const avgWeekMinutes = [...weeksWithData.reduce((prev, curr) =>
      prev.map((val, index) => val + curr[index])
    )].map(value =>
      value / weeksWithData.length
    )

    const avgWeek = chunk(avgWeekMinutes, 60).map(hourMins =>
      hourMins.reduce((prev, curr) => prev + curr)
    )

    // console.log(avgWeek, JSON.stringify(avgWeek))//

    // rotate week until starts on Sunday
    const firstMomentInYear = new Date(Date.UTC(year, 0))
    const firstDay = firstMomentInYear.getDay()
    if (firstDay !== 0) {
      avgWeek.push(...avgWeek.splice(0, firstDay * 24))
    }

    return { topic, year, days, avgDay, avgWeek, maxAge: 60000 }
  } else {
    return error(500, 'invalid topic')
  }
}