import { writeAuditLog } from '$lib/models/audit-log'
import { decodeFilename, fn } from '$lib/models/filename-codec'
import { getOverrideFor, setOverrideFor, deleteOverrideFor } from '$lib/models/index-override'
import { userHasPower } from '$lib/models/user'
import { readEncodedSearchData } from '$lib/orthagonal/write'
import { LoginRedirect } from '../login'

export async function GET ({ locals, params }) {
  if (!locals.username) return LoginRedirect
  if (!await userHasPower(locals.username, 'edit-index')) throw new Error('You don’t have the right to edit search index')

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

export async function POST ({ locals, params, request, url }) {
  if (!locals.username) return LoginRedirect
  if (!await userHasPower(locals.username, 'edit-index')) throw new Error('You don’t have the right to edit search index')
  const [provider, id] = [params.provider, params.id].map(decodeFilename)
  const json = await request.json()
  await writeAuditLog(locals.username, 'override-search-data-entry', `Edited search index override for "${provider}:${id}"`, {
    index: provider,
    entryID: id,
    adminURL: url.pathname,
    publicURL: fn`/sign/${provider}/${id}`,
    object: json
  })
  setOverrideFor(provider, id, json)
}

export async function DELETE ({ locals, params, request, url }) {
  if (!locals.username) return LoginRedirect
  if (!await userHasPower(locals.username, 'edit-index')) throw new Error('You don’t have the right to edit search index')

  const [provider, id] = [params.provider, params.id].map(decodeFilename)
  await writeAuditLog(locals.username, 'override-search-data-entry', `Edited search index override for "${provider}:${id}"`, {
    index: provider,
    entryID: id,
    adminURL: url.pathname,
    publicURL: fn`/sign/${provider}/${id}`,
    object: await getOverrideFor(provider, id)
  })
  await deleteOverrideFor(provider, id)
}