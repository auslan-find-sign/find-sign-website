import { decodeFilename, fn } from '$lib/models/filename-codec'
import { getOverrideFor, setOverrideFor } from '$lib/models/index-override'
import { userHasPower } from '$lib/models/user'
import { readEncodedSearchData } from '$lib/orthagonal/write'
import { LoginRedirect } from '../login'

export async function GET ({ locals, params }) {
  if (!locals.userID) return LoginRedirect
  if (!await userHasPower(locals.userID, 'edit-index')) throw new Error('You don’t have the right to edit search index')

  const [provider, id] = [params.provider, params.id].map(decodeFilename)
  const searchDataURL = import.meta.env.VITE_ENCODED_SEARCH_DATAS + fn`/${provider}.json`
  const searchData = await readEncodedSearchData(searchDataURL)
  const entry = { id, provider: { id: provider }, ...searchData[id] }
  let override = {}
  try {
    override = await getOverrideFor(provider, id)
  } catch (err) {}

  return { body: { entry, override }}
}

export async function POST ({ locals, params, request }) {
  if (!locals.userID) return LoginRedirect
  if (!await userHasPower(locals.userID, 'edit-index')) throw new Error('You don’t have the right to edit search index')
  const [provider, id] = [params.provider, params.id].map(decodeFilename)
  const json = await request.json()
  setOverrideFor(provider, id, json)
}