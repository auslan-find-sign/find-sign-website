import type { PageServerLoad } from './$types'
import { userHasPower } from '$lib/models/user'
import { LoginRedirect } from '../../../../login/passkey/+server'
import { getSearchLibrary } from '$lib/search/search'
import { decodeFilename } from '$lib/models/filename-codec'
import { error } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ locals, params }) => {
  if (!locals.username) return LoginRedirect
  if (!await userHasPower(locals.username, 'edit-index')) throw new Error('You don’t have the right to edit search index')

  const provider = decodeFilename(params.provider)
  const id = decodeFilename(params.id)

  const indexes = await getSearchLibrary([provider], ['id', 'title'])
  const index = indexes[provider]
  const entry = index.entries.find(x => x.id === id)
  if (entry) {
    return { provider, id, entry: await entry.load() }
  } else {
    return error(404)
  }
}