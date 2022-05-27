import delay from '$lib/functions/delay'

/** async iterator outputs progress stream over long polling endpoint from ./progress-log */
export default async function * progressConsumer (endpoint: string, id: string) {
  let index = 0
  let finished = false
  while (!finished) {
    const path = new URL(endpoint, location.href)
    path.searchParams.set('id', id)
    path.searchParams.set('index', `${index}`)
    const response = await fetch(path.toString())
    const json = await response.json()
    if ('index' in json) index = json.index
    if ('finished' in json) finished = json.finished
    if ('progress' in json) yield { progress: json.progress }
    if ('logs' in json && json.logs.length > 0) yield * json.logs
    await delay(10)
  }
  yield { progress: 1.0 }
}
