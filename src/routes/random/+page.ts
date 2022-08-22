import type { PageLoad } from './$types'
import { redirect } from '@sveltejs/kit'
import { getSearchLibrary } from '$lib/search/search'
import { getRandomSigns } from '$lib/search/random'
import { fn } from '$lib/models/filename-codec'
import clientRecordAnalytics from '$lib/models/client-record-analytics'
import { browser } from '$app/env'

export const load: PageLoad = async function load ({ url, fetch }) {
  const index = url.searchParams.get('index')
  const id = url.searchParams.get('id')
  let randoms = await getRandomSigns(2)

  if (index && id) {
    randoms[0] = { index, id }
  } else {
    throw redirect(307, `/random?${new URLSearchParams([['index', randoms[1].index], ['id', randoms[1].id]])}`)
  }
  const library = await getSearchLibrary([randoms[0].index], ['id'])
  const result = await library[randoms[0].index].entries.find(x => x.id === randoms[0].id).load()
  const next = `/random?${new URLSearchParams([['index', randoms[1].index], ['id', randoms[1].id]])}`
  const permalink = fn`/sign/${randoms[0].index}/${randoms[0].id}`

  if (browser) {
    clientRecordAnalytics('random', fetch)
  }

  return { result, permalink, next }
}
