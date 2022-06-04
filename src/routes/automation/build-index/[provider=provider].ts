import { decodeFilename, fn } from '$lib/models/filename-codec'
import { readEncodedSearchData, writeIndex } from '$lib/orthagonal/write'
import { lookup } from '$lib/search/loaded-precomputed-vectors'
import { bulkWrite } from '$lib/data-io/data-io'

/** endpoint for cron-like tasks to automatically rebuild orthagonal indexes after encoder has done it's work */
export async function get ({ url, params }) {
  if (url.searchParams.get('key') !== import.meta.env.VITE_AUTOMATION_KEY) return { status: 400 }

  const provider = decodeFilename(params.provider)
  const log = []

  log.push(`Reading search data ${params.provider}...`)
  const searchData = await readEncodedSearchData(import.meta.env.VITE_ENCODED_SEARCH_DATAS + fn`/${provider}.json`)
  log.push(`Building orthagonal index in memory...`)
  const files = await writeIndex(searchData, {
    lookupVector: word => lookup(word),
    log: (...args) => log.push(args.join(' ')),
  })
  log.push('Search index files constructed, writing...')
  await bulkWrite(fn`index/${provider}`, files)

  return {
    headers: { 'Content-Type': 'text/plain' },
    body: log.join('\n')
  }
}