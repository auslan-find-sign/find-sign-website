import { bulkWrite, writeFile } from '$lib/data-io/data-io'
import { userHasPower } from '$lib/models/user'
import { readEncodedSearchData, writeIndex } from '$lib/orthagonal/write'
import { lookup } from '$lib/search/loaded-precomputed-vectors'
import { LoginRedirect } from '../../login'

// export async function get ({ locals, params }) {

// }

export async function post ({ locals, params }) {
  if (!locals.userID) return LoginRedirect
  if (!await userHasPower(locals.userID, 'edit-index')) throw new Error('You don’t have the right to edit search index')

  console.log(`Reading search data ${params.provider}...`)
  const searchData = await readEncodedSearchData(`${import.meta.env.VITE_ENCODED_SEARCH_DATAS}/${params.provider}.json`)
  console.log(`Building orthagonal index in memory...`)
  const files = await writeIndex(searchData, word => lookup(word))
  console.log(`Search index files constructed, writing...`)
  await bulkWrite(`index/${params.provider}`, files)
  console.log('Build complete')

  return { body: { success: true } }
}