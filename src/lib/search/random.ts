import { getSearchLibrary } from '$lib/search/search'
import { getProviderIDForLibraryEntry } from '$lib/search/search-index'

export const blockedTags = [
  'signpedia', // block signpedia-like entries, not established signs
  'invented', // block toddslan-like entries
  'lexis.crude', // block rude signbank stuff, want relatively unshocking kid friendly results
  'semantic.sexuality' // block formal register sexual body parts type of words
]

export async function getRandomSigns (count: number): Promise<[provider: string, entry: string][]> {
  const library = await getSearchLibrary()
  const signs = []

  for (let i = 0; i < 100 * count; i++) {
    const random = library.index[Math.round(Math.random() * (library.index.length - 1))]
    const tagMatch = blockedTags.some(x => random.tags.includes(x))
    if (!tagMatch) {
      // load the result and set it up as the answer
      signs.push(await getProviderIDForLibraryEntry(library, random))
      if (signs.length >= count) return signs
    }
  }
}
