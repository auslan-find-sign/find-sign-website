import { decodeFilename, fn } from '$lib/models/filename-codec'
import { readEncodedSearchData, writeIndex } from '$lib/orthagonal/write'
import { lookup } from '$lib/search/loaded-precomputed-vectors'
import { bulkWrite, readFile, writeFile } from '$lib/data-io/data-io'
import { build, parse } from '$lib/search/precomputed-vectors'

/** endpoint for cron-like tasks to automatically rebuild orthagonal indexes after encoder has done it's work */
export async function GET ({ url, params }) {
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

        controller.enqueue(`Rebuilding global word vector cache: Loading vector files...\n`)
        const vectorFiles = await Promise.all(import.meta.env.VITE_SEARCH_INDEXES.split(',').map(async provider =>
          parse(await readFile(`index/${provider}/vectors.lps`))
        ))
        controller.enqueue(`Building global word vector cache...\n`)
        const globalVectors = {}
        for (const vectors of vectorFiles) {
          for (const { word, getVector } of vectors) {
            if (!globalVectors[word]) globalVectors[word] = getVector()
          }
        }
        controller.enqueue(`Writing global word vector cache...\n`)
        await writeFile('index/global-vectors.lps', build(globalVectors, parseFloat(import.meta.env.VITE_VECTOR_FIDELITY || '1.0')))

        controller.enqueue('Done\n')
        controller.close()
      }
    })
  }
}