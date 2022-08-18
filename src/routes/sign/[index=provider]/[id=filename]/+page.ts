import { error } from '@sveltejs/kit';
import { getSearchLibrary } from '$lib/search/search'
import { decodeFilename } from '$lib/models/filename-codec'
import { availableIndexes } from '$lib/search/search'

export async function load ({ params }) {
  const index = decodeFilename(params.index)
  const id = decodeFilename(params.id)
  if (availableIndexes.includes(index)) {
    const library = await getSearchLibrary([index], ['id'])
    const entry = library[index].entries.find(x => x.id === id)
    if (entry) {
      const result = await entry.load()
      return { result }
    }
  }
  throw error(404);
}
