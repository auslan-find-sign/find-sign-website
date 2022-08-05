import { userHasPower } from '$lib/models/user'
import { LoginRedirect } from '../../../../login'
import { getSearchLibrary } from '$lib/search/search'
import { decodeFilename } from '$lib/models/filename-codec'

export async function GET ({ locals, params }) {
  if (!locals.userID) return LoginRedirect
  if (!await userHasPower(locals.userID, 'edit-index')) throw new Error('You don’t have the right to edit search index')

  const provider = decodeFilename(params.provider)
  const id = decodeFilename(params.id)

  const indexes = await getSearchLibrary([provider], ['id', 'title'])
  const index = indexes[provider]
  const entry = index.entries.find(x => x.id === id)
  if (entry) {
    return { body: { provider, id, entry: await entry.load() } }
  } else {
    return { status: 404 }
  }
}