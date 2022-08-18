import delay from '$lib/functions/delay'
import { createProgressLog, nextUpdate } from '$lib/progress/progress-log'

export async function load ({ url }) {
  const id = url.searchParams.get('id')
  const index = url.searchParams.get('index')
  console.log(url.toString())

  if (!id) {
    return createProgressLog(async ({ log, progress }) => {
  for (let i = 0; i < 100; i++) {
    await delay(100)
    log('Hey the I is', i)
    progress(i / 100)
  }
})
  } else {
    return await nextUpdate(id, parseInt(index))
  }
}