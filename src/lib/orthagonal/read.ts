import { parse as parseVectorPack, type WordVector } from '$lib/search/precomputed-vectors'
import { timesMap } from '$lib/search/times'
import type { EncodedSearchDataEntry, OrthagonalColumnData, OrthagonalColumns, OrthagonalIndex } from './types'

// const SearchDataPath = import.meta.env.VITE_SEARCH_DATA

export type LoadedOrthagonalIndex = {
  url: string,
  meta: OrthagonalIndex,
  entries: LoadedOrthagonalEntry[]
}

export type LoadedOrthagonalEntry = {
  id?: string, // entry name
  title?: string, // entry string title
  words?: string[], // normalized searchable words
  vectors?: WordVector[], // searchable word vectors
  link?: string, // link this entry points to
  tags?: string[], // list of hashtags
  author?: {
    id?: string, // author username with tag-like character rules
    name?: string, // human friendly name e.g. display name or real name
    link?: string, // url to author's site/profile
    avatar?: string, // url to author's avatar image
  },
  provider?: {
    id?: string,
    name?: string, // friendly name
    link?: string, // url link to provider website
    verb?: string, // discovery verb like 'shared' or 'invented'
  }
  timestamp?: number, // epochMs timestamp
  load: () => Promise<EncodedSearchDataEntry>
}

export class OutdatedError extends Error {
  indexURL: string

  constructor (message, indexURL) {
    super(`${message}: ${indexURL}`)
    this.indexURL = indexURL
  }
}

/** load the search index */
export async function loadIndex (url: string, columns = [], forceReload = false): Promise<LoadedOrthagonalIndex> {
  try {
    const columnData = {}
    const forceRecheck: RequestInit = { cache: 'no-cache' }
    const lazyCache: RequestInit = { cache: 'default' }
    const loadOptions: RequestInit = forceReload ? forceRecheck : lazyCache

    const [meta, vectors] = await Promise.all([
      fetch(`${url}/meta.json`, forceRecheck).then(x => x.json()),
      columns.includes('vectors') ? fetch(`${url}/vectors.lps`, loadOptions)
        .then(x => x.arrayBuffer())
        .then(arrayBuffer => {
          const output = {}
          for (const { word, getVector } of parseVectorPack(new Uint8Array(arrayBuffer))) {
            output[word] = getVector()
          }
          return output
        }) : Promise.resolve({}),
      ...columns.filter(x => x !== 'vectors').map(async (name: string) => {
        const response = await fetch(`${url}/${name}.json`, loadOptions)
        const data: OrthagonalColumnData = await response.json()
        columnData[name] = data
      })
    ])

    const index: LoadedOrthagonalIndex = {
      url,
      meta,
      entries: timesMap(meta.entries, idx => {
        const obj = {
          /** searchable vectors */
          vectors: [],
          /** load this entry's full definition file */
          load: async () => loadEntry(index, idx)
        }
        for (const columnName of columns) {
          if (columnName === 'vectors') continue
          const { isVectorIndexed, type: columnType } = meta.columns[columnName]
          const data = columnData[columnName]
          if (data.buildID !== meta.buildID) throw new OutdatedError('Column buildID doesn’t match meta buildID', url)
          if (data.entries[idx] !== null) {
            obj[columnName] = data.entries[idx]
          } else {
            obj[columnName] = {
              'string': '',
              'string[]': [],
              'number': 0,
              'number[]': [],
              'object': {}
            }[columnType]
          }
          if (isVectorIndexed && columns.includes('vectors')) {
            for (const word of data.entries[idx]) {
              const vector = vectors[word] || vectors[word.toLowerCase()]
              if (vector) obj.vectors.push(vector)
            }
          }
        }
        return obj
      })
    }

    return index
  } catch (err) {
    if (forceReload === false && err instanceof OutdatedError) {
      return await loadIndex(url, columns, true)
    } else {
      throw err
    }
  }
}

/** load an entry from an index using it's entry number */
export async function loadEntry (index: LoadedOrthagonalIndex, number: number): Promise<EncodedSearchDataEntry> {
  const shardNumber = Math.floor(number / index.meta.entriesPerShard)
  const entryNumber = number % index.meta.entriesPerShard
  const response = await fetch(`${index.url}/shard-${shardNumber}.json`, { cache: 'no-store' })
  const json: OrthagonalColumnData = await response.json()
  if (json.buildID !== index.meta.buildID) throw new OutdatedError('Entry buildID unsyncronized, reload', index.url)
  return json.entries[entryNumber]
}