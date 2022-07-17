import { decodeFilename, fn } from '$lib/models/filename-codec'
import { readEncodedSearchData, writeIndex } from '$lib/orthagonal/write'
import { lookup } from '$lib/search/loaded-precomputed-vectors'
import { bulkWrite } from '$lib/data-io/data-io'

/** endpoint for cron-like tasks to automatically rebuild orthagonal indexes after encoder has done it's work */
export async function get ({ url, params }) {
  if (url.searchParams.get('key') !== import.meta.env.VITE_AUTOMATION_KEY) return { status: 400, body: 'needs automation key query string param' }

  const provider = decodeFilename(params.provider)

  return {
    headers: { 'Content-Type': 'text/plain' },
    body: new ReadableStream({
      async start (controller) {
        controller.enqueue(`Reading search data ${params.provider}...\n`)
        const searchData = await readEncodedSearchData(import.meta.env.VITE_ENCODED_SEARCH_DATAS + fn`/${provider}.json`)
        controller.enqueue(`Building orthagonal index in memory...\n`)

        let lastProgress = 0.0
        const files = await writeIndex(searchData, {
          lookupVector: word => lookup(word),
          log: (...args) => controller.enqueue(args.join(' ') + '\n'),
          progress: (num) => {
            if (num > lastProgress + 0.05 || num === 1.0) {
              controller.enqueue(`Progress: ${Math.round(num * 100)}%\n`)
              lastProgress = Math.round(num * 100) / 100
            }
          }
        })
        controller.enqueue('Search index files constructed, writing...\n')
        await bulkWrite(fn`index/${provider}`, files)
        controller.enqueue('Done\n')
        controller.close()
      }
    })
  }
}