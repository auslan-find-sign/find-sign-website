import type { Library, SearchDataItem } from './search-index'
import { open, freshen, getResultByNumericPath } from '$lib/search/search-index'
import { lookup } from '$lib/search/loaded-precomputed-vectors'
import rank from '$lib/search/search-rank'
import { compileQuery, normalizeWord } from '$lib/search/text'
import lru from '$lib/functions/lru'
import siteConfig from '$lib/site-config.json'

const freshenInterval = 1000 * 60 // 1 minute

let searchLibrary: Library = undefined
let lastQuery: string|undefined = undefined
let lastFreshenTimestamp: number = 0
let cachedRankedIndex = undefined
let resultItemCache = lru(100)

type SearchResponse = {
  results: SearchDataItem[],
  totalResults: number
}

export async function getSearchLibrary (): Promise<Library> {
  if (!searchLibrary) {
    searchLibrary = await open(siteConfig.searchIndex)
    cachedRankedIndex = undefined
    lastFreshenTimestamp = Date.now()
  }

  if (lastFreshenTimestamp < Date.now() - freshenInterval) {
    searchLibrary = await freshen(searchLibrary)
    cachedRankedIndex = undefined
    lastFreshenTimestamp = Date.now()
  }

  return searchLibrary
}

export async function search (query: string, start: number, length: number): Promise<SearchResponse> {
  const library = await getSearchLibrary()

  if (!cachedRankedIndex) {
    const queryFn = await compileQuery(query, async (word) => {
      const normalized = normalizeWord(word)
      const normalizedResult = await lookup(normalized)
      if (normalizedResult) {
        return normalizedResult
      } else if (normalized !== normalized.toLowerCase()) {
        const lowerCasedResult = await lookup(normalized.toLowerCase())
        return lowerCasedResult
      }
    })

    cachedRankedIndex = rank(library, queryFn)
  }

  const resultEntries = cachedRankedIndex.index.slice(start, start + length)
  const results = await Promise.all(resultEntries.map(entry => {
    return resultItemCache(JSON.stringify(entry.path), (key) => {
      return getResultByNumericPath(searchLibrary, JSON.parse(key))
    })
  }))

  return {
    totalResults: cachedRankedIndex.index.length,
    results
  }
}