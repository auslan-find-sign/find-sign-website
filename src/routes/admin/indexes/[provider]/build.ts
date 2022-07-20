import { bulkWrite, readFile, writeFile } from '$lib/data-io/data-io'
import { userHasPower } from '$lib/models/user'
import { readEncodedSearchData, writeIndex } from '$lib/orthagonal/write'
import { createProgressLog, nextUpdate } from '$lib/progress/progress-log'
import { lookup } from '$lib/search/loaded-precomputed-vectors'
import { build, parse } from '$lib/search/precomputed-vectors'
import { LoginRedirect } from '../../login'

/** long polling endpoint for progress and log streaming from the post endpoints long running output */
export async function GET ({ url }) {
  const update = await nextUpdate(url.searchParams.get('id'), parseInt(url.searchParams.get('index')))
  return { body: update }
}

/** endpoint for manually rebuilding search index, e.g. after authoring an index override */
export async function POST ({ locals, params }) {
  if (!locals.userID) return LoginRedirect
  if (!await userHasPower(locals.userID, 'edit-index')) throw new Error('You don’t have the right to edit search index')

  const progress = createProgressLog(async ({ log, progress }) => {
    log(`Reading search data ${params.provider}...`)
    const searchData = await readEncodedSearchData(`${import.meta.env.VITE_ENCODED_SEARCH_DATAS}/${params.provider}.json`)
    log(`Building orthagonal index in memory...`)
    const files = await writeIndex(searchData, {
      lookupVector: word => lookup(word),
      log,
      progress: (num) => progress(num * 0.95)
    })
    log(`Search index files constructed, writing...`)
    progress(0.96)
    await bulkWrite(`index/${params.provider}`, files)
    progress(0.97)
    log(`Rebuilding global word vector cache: Loading vector files...`)
    const vectorFiles = await Promise.all(import.meta.env.VITE_SEARCH_INDEXES.split(',').map(async provider =>
      parse(await readFile(`index/${provider}/vectors.lps`))
    ))
    progress(0.98)
    log(`Building global word vector cache...`)
    const globalVectors = {}
    for (const vectors of vectorFiles) {
      for (const { word, getVector } of vectors) {
        if (!globalVectors[word]) globalVectors[word] = getVector()
      }
    }
    progress(0.99)
    log(`Writing global word vector cache...`)
    await writeFile('index/global-vectors.lps', build(globalVectors, parseFloat(import.meta.env.VITE_VECTOR_FIDELITY || '1.0')))
    progress(1.00)
    log('Build complete')
  })

  return { body: { progress } }
}