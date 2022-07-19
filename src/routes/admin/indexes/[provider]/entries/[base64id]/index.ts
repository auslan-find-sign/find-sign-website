import { userHasPower } from '$lib/models/user'
import { loadIndex } from '$lib/orthagonal/read'
import { LoginRedirect } from '../../../../login'
import { decode as decodeB64 } from '@borderless/base64'
import { bytesToString } from '$lib/functions/string-encode'

export async function GET ({ locals, params }) {
  if (!locals.userID) return LoginRedirect
  if (!await userHasPower(locals.userID, 'edit-index')) throw new Error('You don’t have the right to edit search index')

  const { provider, base64id } = params
  const id = bytesToString(decodeB64(base64id))

  const index = await loadIndex(`${import.meta.env.VITE_SEARCH_INDEX_PATH}/${encodeURIComponent(params.provider)}`, ['id'])
  const entry = index.entries.find(x => x.id === id)
  if (entry) {
    return { body: { provider, id, entry: await entry.load() } }
  } else {
    return { status: 404 }
  }
}