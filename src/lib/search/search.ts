// import { getResult, type Library, type SearchDataItem } from './search-index'
// import { open, freshen, getResultByNumericPath } from '$lib/search/search-index'
import { loadIndex, OutdatedError, type LoadedOrthagonalIndex } from '$lib/orthagonal/read'
import type { EncodedSearchDataEntry } from '$lib/orthagonal/types'
import { lookup } from '$lib/search/loaded-precomputed-vectors'
import rank from '$lib/search/search-rank'
import { checkQueryContainsWords, compileQuery } from '$lib/search/text'
import normalizeWord from '$lib/orthagonal/normalize-word'
import { encodeFilename } from '$lib/models/filename-codec'
import lru from '$lib/functions/lru'
import openGlobalVectors from './global-vectors'
import type { WordVector } from './precomputed-vectors'

export const availableIndexes = import.meta.env.VITE_SEARCH_INDEXES.split(',')
const indexURLs = Object.fromEntries(availableIndexes.map(name => {
  return [name, `${import.meta.env.VITE_SEARCH_INDEX_PATH}/${encodeFilename(name)}`]
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
export async function getSearchLibrary (limitLibraries: string[] | false = false, columns = ['words', 'tags'], forceReload = false, globalVectors?: { [word: string]: WordVector }): Promise<SearchLibrary> {
  if (limitLibraries === false) limitLibraries = Object.keys(indexURLs)

  const collection = Object.fromEntries(await Promise.all(limitLibraries.map(async name => {
    const index = await loadIndex(indexURLs[name], columns, forceReload, globalVectors)
    return [name, index]
  })))

  // TODO: implement freshen logic and caching of loaded libraries?
  return collection
}

let globalVectors: { [word: string]: Float32Array }

export async function search (query: string, start: number, length: number, forceReload = false): Promise<SearchResponse> {
  // load the globalVector cache
  if (!globalVectors && checkQueryContainsWords(query)) {
    globalVectors = await openGlobalVectors(`${import.meta.env.VITE_SEARCH_INDEX_PATH}/global-vectors.lps`)
  }

  const lookupLocal = async function (word) {
    if (globalVectors && globalVectors[word]) return globalVectors[word]
    return lookup(word)
  }

  if (query !== lastQuery || !compiledQuery) {
    compiledQuery = await compileQuery(query, async (word) => {
      const normalized = normalizeWord(word)
      const normalizedResult = await lookupLocal(normalized)
      if (normalizedResult) {
        return normalizedResult
      } else if (normalized !== normalized.toLowerCase()) {
        const lowerCasedResult = await lookupLocal(normalized.toLowerCase())
        return lowerCasedResult
      }
    })
  }

  const { requirements: columns, rank: rankFn } = compiledQuery
  const library = await getSearchLibrary(false, columns, forceReload, globalVectors)

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