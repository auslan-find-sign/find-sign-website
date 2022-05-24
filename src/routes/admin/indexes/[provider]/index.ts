import { userHasPower } from '$lib/models/user'
import { loadIndex } from '$lib/orthagonal/read'
import { LoginRedirect } from '../../login'

export async function get ({ locals, params }) {
  if (!locals.userID) return LoginRedirect
  if (!await userHasPower(locals.userID, 'edit-index')) throw new Error('You don’t have the right to edit search index')

  const index = await loadIndex(`${import.meta.env.VITE_SEARCH_INDEX_PATH}/${encodeURIComponent(params.provider)}`, ['id', 'title'])
  return { body: {
    provider: params.provider,
    meta: index.meta,
    entries: index.entries.map(x => ({ id: x.id, title: x.title }))
  } }
}