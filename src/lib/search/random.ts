import { getSearchLibrary } from '$lib/search/search'
import { getProviderIDForLibraryEntry } from '$lib/search/search-index'

export const blockedTags = [
  'signpedia', // block signpedia-like entries, not established signs
  'invented', // block toddslan-like entries
  'lexis.crude', // block rude signbank stuff, want relatively unshocking kid friendly results
  'semantic.sexuality', // block formal register sexual body parts type of words
  'lexis.fingerspell' // fingerspelling entries are too boring
]

export async function getRandomSigns (count: number): Promise<{provider: string, id: string}[]> {
  const library = await getSearchLibrary(false, ['id', 'tags'])
  const index = Object.entries(library).flatMap(([providerID, data]) => {
    return data.entries.map(entry => ({ providerID, ...entry }))
  }).filter(entry => {
    return blockedTags.every(tag => !entry.tags.includes(tag))
  })
  const signs = []

  for (let i = 0; i < count; i++) {
    const random = index[Math.round(Math.random() * (index.length - 1))]
    signs.push({ provider: random.providerID, id: random.id })
  }
  return signs
}
