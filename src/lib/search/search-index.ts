// tree shakable functions for consuming sign-search search indexes
import { unpack } from './packed-vector'
import { diversity as vectorDiversity } from './vector-utilities'
import { chunk } from './times'
// import { decodeCBOR } from './io'
import { decode as decodeCBOR } from 'cbor-codec/esm/index.mjs'

export type Library = {
  path?: string, // path to search index root folder, that is the folder containing index.cbor
  tags: Set<string>, // all hashtags used within the search index
  index: LibraryEntry[], // array of LibraryEntry objects, comprising the search index
  settings: any,
  etag?: string,
  lastModified?: string
  dataPaths?: object // optional dataPaths index for server side lookup by provider/id paths
}

export type LibraryEntry = {
  words: EntryWord[], // wordvecs and strings, the searchable terms
  tags: string[], // hashtags, without the hash prefix
  diversity: number, // number representing how similar the wordvecs in .words are
  path: [number, number],
  rank?: number
}

export type SearchDataItem = {
  library: Library,
  words?: EntryWord[], // wordvecs and strings, the searchable terms
  diversity?: number, // number representing how similar the wordvecs in .words are
  rank?: number

  path: [number, number],
  title?: string, // optional string title, if not present, generated from keywords
  keywords: string[], // array of searchable words associated with the meaning of the sign
  tags: string[], // hashtags, without the hash prefix
  body: string, // body text
  link: string, // url to original source document
  provider: string, // provider spider, e.g. 'asphyxia'
  id: string, // unique (within provider) identifier for this specific sign
  nav?: NavEntry[], // breadcrumbs for navigation in that provider's site structure
  media: MediaItem[],
  timestamp?: number // if known, the last time this entry was changed
}

export type NavEntry = [title: string, link: string]
export type MediaItem = MediaItemFormat[]
export type MediaItemFormat = {
  extension: string,
  src: string, // url, possibly relative path
  type: string, // mime type
  maxWidth: number,
  maxHeight: number
}


export type EntryVector = readonly number[]
export type EntryWord = EntryVector | string

export async function open (path: string): Promise<Library> {
  return await freshen({ path, tags: new Set(), index: [], settings: {} })
}

// Parse an search library index file
export function parseIndex (data: ArrayBuffer): Library {
  const { settings, symbols, index } = decodeCBOR(data)
  if (settings.version !== 4) throw new Error('Unsupported dataset format version')

  // decode symbols
  symbols.forEach((value, index) => {
    if (typeof value !== 'string') {
      // byte arrays need to be decoded in to float array word vectors
      symbols[index] = unpack(value, settings.vectorBits, settings.vectorSize)
    }
  })

  return {
    settings,
    tags: new Set(Object.keys(index).flatMap(x => x.split(',').map(id => symbols[id]))),
    index: Object.entries(index).flatMap(([tagSymbols, entries]) => {
      const tags = tagSymbols.split(',').map(id => symbols[id])
      return Object.entries(entries).flatMap(([wordSymbols, paths]) => {
        const words = wordSymbols.split(',').map(id => symbols[id])
        const diversity = Math.max(...vectorDiversity(...words.filter(x => typeof x !== 'string')))
        return chunk(paths, 2).map((path: [number,number]) => {
          return { words, tags, diversity, path }
        })
      })
    }),
  }
}

// Given a library, check server for a more up to date version, and if available, load it
export async function freshen (library: Library): Promise<Library> {
  const headers = {}

  if (library.etag) headers['If-None-Match'] = library.etag
  if (library.lastModified) headers['If-Modified-Since'] = library.lastModified

  const response = await fetch(`${library.path}/index.cbor`, { headers, mode: 'cors' })
  if (response.status === 304) return library
  else if (response.status !== 200) console.warn('server response weird', response)

  return {
    ...library,
    ...parseIndex(await response.arrayBuffer()),
    etag: response.headers.get('ETag'),
    lastModified: response.headers.get('Last-Modified')
  }
}

// Given a LibraryEntry, load the search index result data and return it
export async function getResult (library: Library, entry: LibraryEntry): Promise<SearchDataItem> {
  // calculate url, load shard file, decode it
  const [shardNumber, item] = entry.path
  const shardURL = `${library.path}/definitions/${library.settings.buildID}/${shardNumber}.cbor`
  const response = await fetch(shardURL, { mode: 'cors', cache: 'force-cache' })
  const shard = decodeCBOR(await response.arrayBuffer())
  return {
    library,
    ...shard[item],
    media: shard[item].media.map(paths => {
      return library.settings.mediaSets.map(mediaSet => {
        const path = paths[mediaSet.extension]
        const src = `${library.path}/media/${path}`
        return Object.assign(Object.create(mediaSet), { path, src })
      })
    })
  }
}

async function loadDataPaths (library: Library): Promise<void> {
  if (!library.dataPaths) {
    const response = await fetch(library.path + '/data-paths.cbor', { mode: 'cors', cache: 'default' })
    library.dataPaths = decodeCBOR(await response.arrayBuffer())
  }
}

// used for sitemap generation, returns a list of providers in the search results
export async function getProviders (library: Library) {
  await loadDataPaths(library)
  return Object.keys(library.dataPaths)
}

// used for sitemap generation, returns a list of providers in the search results
export async function getProviderIDs (library: Library, provider: string) {
  await loadDataPaths(library)
  return Object.keys(library.dataPaths[provider])
}



// Get a search index result by provider-id/entry-id path
export async function getResultByPath (library: Library, provider: string, id: string) {
  await loadDataPaths(library)

  return await getResult(library, {
    path: library.dataPaths[provider][id],
    words: [],
    tags: [],
    diversity: 0,
  })
}
