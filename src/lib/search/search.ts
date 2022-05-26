// import { getResult, type Library, type SearchDataItem } from './search-index'
// import { open, freshen, getResultByNumericPath } from '$lib/search/search-index'
import { loadIndex, OutdatedError, type LoadedOrthagonalIndex } from '$lib/orthagonal/read'
import type { EncodedSearchDataEntry } from '$lib/orthagonal/types'
import { lookup } from '$lib/search/loaded-precomputed-vectors'
import rank from '$lib/search/search-rank'
import { compileQuery } from '$lib/search/text'
import normalizeWord from '$lib/orthagonal/normalize-word'
import lru from '$lib/functions/lru'

const freshenInterval = 1000 * 60 * 10 // 10 minutes

const indexURLs = Object.fromEntries(import.meta.env.VITE_SEARCH_INDEXES.split(',').map(name => {
  return [name, `${import.meta.env.VITE_SEARCH_INDEX_PATH}/${encodeURIComponent(name)}`]
}))

// let searchLibrary: Library = undefined
// let searchLibraries = {}
let lastQuery: string|undefined = undefined
let compiledQuery: { rank: (EncodedSearchDataEntry) => number, requirements: string[] } = undefined
// let lastFreshenTimestamp: number = 0
let cachedRankedIndex = undefined
// let resultItemCache = lru(100)

export type SearchResponse = {
  results: EncodedSearchDataEntry[],
  totalResults: number
}

export type SearchLibrary = {
  [name: string]: LoadedOrthagonalIndex
}

/** limit libraries maybe an array of provider ids */
export async function getSearchLibrary (limitLibraries: string[] | false = false, columns = ['words', 'tags'], forceReload = false): Promise<SearchLibrary> {
  if (limitLibraries === false) limitLibraries = Object.keys(indexURLs)

  const collection = Object.fromEntries(await Promise.all(limitLibraries.map(async name => {
    const index = await loadIndex(indexURLs[name], columns, forceReload)
    return [name, index]
  })))

  // TODO: implement freshen logic and caching of loaded libraries?
  return collection
}

export async function search (query: string, start: number, length: number, forceReload = false): Promise<SearchResponse> {
  if (query !== lastQuery || !compiledQuery) {
    compiledQuery = await compileQuery(query, async (word) => {
      const normalized = normalizeWord(word)
      const normalizedResult = await lookup(normalized)
      if (normalizedResult) {
        return normalizedResult
      } else if (normalized !== normalized.toLowerCase()) {
        const lowerCasedResult = await lookup(normalized.toLowerCase())
        return lowerCasedResult
      }
    })
  }

  const { requirements: columns, rank: rankFn } = compiledQuery
  const library = await getSearchLibrary(false, columns, forceReload)

  if (query !== lastQuery) cachedRankedIndex = undefined

  if (!cachedRankedIndex) {
    cachedRankedIndex = rank(library, rankFn)
  }

  lastQuery = query

  const resultEntries = cachedRankedIndex.entries.slice(start, start + length)
  let results
  try {
    results = await Promise.all(resultEntries.map(entry => {
      return entry.load()
    }))
  } catch (error) {
    if (error instanceof OutdatedError) {
      if (forceReload === false) {
        return await search(query, start, length, true)
      }
      throw error
    }
  }

  return {
    totalResults: cachedRankedIndex.entries.length,
    results
  }
}