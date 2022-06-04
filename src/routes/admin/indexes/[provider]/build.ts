import { bulkWrite } from '$lib/data-io/data-io'
import { userHasPower } from '$lib/models/user'
import { readEncodedSearchData, writeIndex } from '$lib/orthagonal/write'
import { createProgressLog, nextUpdate } from '$lib/progress/progress-log'
import { lookup } from '$lib/search/loaded-precomputed-vectors'
import { LoginRedirect } from '../../login'

/** long polling endpoint for progress and log streaming from the post endpoints long running output */
export async function get ({ url }) {
  const update = await nextUpdate(url.searchParams.get('id'), parseInt(url.searchParams.get('index')))
  return { body: update }
}

/** endpoint for manually rebuilding search index, e.g. after authoring an index override */
export async function post ({ locals, params }) {
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
    progress(1.00)
    log('Build complete')
  })

  return { body: { progress } }
}