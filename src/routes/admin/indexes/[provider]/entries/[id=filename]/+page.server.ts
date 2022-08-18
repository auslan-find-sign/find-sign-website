import { userHasPower } from '$lib/models/user'
import { LoginRedirect } from '../../../../login'
import { getSearchLibrary } from '$lib/search/search'
import { decodeFilename } from '$lib/models/filename-codec'

export async function load ({ locals, params }) {
  if (!locals.username) throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");
  return LoginRedirect
  if (!await userHasPower(locals.username, 'edit-index')) throw new Error('You don’t have the right to edit search index')

  const provider = decodeFilename(params.provider)
  const id = decodeFilename(params.id)

  const indexes = await getSearchLibrary([provider], ['id', 'title'])
  const index = indexes[provider]
  const entry = index.entries.find(x => x.id === id)
  if (entry) {
    return { provider, id, entry: await entry.load() }
  } else {
    throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");
    return { status: 404 }
  }
}