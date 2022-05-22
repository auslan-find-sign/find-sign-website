import { parse as parseVectorPack, type WordVector } from '$lib/search/precomputed-vectors'
import { timesMap } from '$lib/search/times'
import type { OrthagonalColumnData, OrthagonalColumns, OrthagonalIndex } from './types'

// const SearchDataPath = import.meta.env.VITE_SEARCH_DATA

export type LoadedOrthagonalIndex = {
  url: string,
  meta: OrthagonalIndex,
  entries: {
    id?: string, // entry name
    title?: string, // entry string title
    words?: string[], // normalized searchable words
    vectors?: WordVector[], // searchable word vectors
    link?: string, // link this entry points to
    tags?: string[], // list of hashtags
    author?: {
      name: string, // human friendly name
      link?: string, // url to author's site/profile
      avatar?: string, // url to author's avatar image
    }
  }[]
}

export class OutdatedError extends Error {}

/** load the search index */
export async function loadIndex (url: string, columns = []): Promise<LoadedOrthagonalIndex> {
  const columnData = {}
  const [meta, vectors] = await Promise.all([
    fetch(`${url}/meta.json`).then(x => x.json()),
    fetch(`${url}/vectors.lps`).then(x => x.arrayBuffer()).then(arrayBuffer => {
      const output = {}
      for (const { word, getVector } of parseVectorPack(new Uint8Array(arrayBuffer))) {
        output[word] = getVector()
      }
      return output
    }),
    ...columns.map(async (name: string) => {
      const response = await fetch(`${url}/${name}.json`)
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
      for (const columnName in meta.columns) {
        const { isVectorIndexed } = meta.columns[columnName]
        const data = columnData[columnName]
        if (data.buildID !== meta.buildID) throw new OutdatedError('Column buildID doesn’t match meta buildID')
        if (data[idx] !== null) obj[columnName] = data[idx]
        if (isVectorIndexed) {
          for (const word of data[idx]) {
            if (vectors[word]) obj.vectors.push(vectors[word])
          }
        }
      }
    })
  }

  return index
}

/** load an entry from an index using it's entry number */
export async function loadEntry (index: LoadedOrthagonalIndex, number: number) {
  const shardNumber = Math.floor(number / index.meta.entriesPerShard)
  const entryNumber = number % index.meta.entriesPerShard
  const response = await fetch(`${index.url}/shard-${shardNumber}.json`)
  const json: OrthagonalColumnData = await response.json()
  if (json.buildID !== index.meta.buildID) throw new OutdatedError('Entry buildID unsyncronized, reload')
  return json.entries[entryNumber]
}