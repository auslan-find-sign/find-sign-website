import { build as buildVectorShard } from '$lib/search/precomputed-vectors'
import type { OrthagonalColumns, EncodedSearchData, OrthagonalIndex } from './types'
import normalizeWord from './normalize-word'
import { chunk } from '$lib/search/times'
import { nanoid } from 'nanoid'

/** read an encoded-search-data from a url, transforming all URLs to be absolute */
export async function readEncodedSearchData (url: string): Promise<EncodedSearchData> {
  const response = await fetch(url)
  const json: EncodedSearchData = await response.json()
  for (const id in json) {
    const entry = json[id]
    if (!entry.title && entry.words) {
      entry.title = entry.words.join(', ')
    }
    if (!entry.words && entry.title) {
      /** @ts-ignore */
      const seg = new Intl.Segmenter(import.meta.env.VITE_LOCALE, { granularity: 'word' }) // node 16.x
      entry.words = [...seg.segment(entry.title)].filter(x => x.isWordLike).map(x => x.segment)
    }
    // make all the links absolute
    if (entry.link) entry.link = (new URL(entry.link, url)).toString()
    if (entry.nav) entry.nav = entry.nav.map(([label, link]) => [label, (new URL(link, url)).toString()])
    if (entry.author && entry.author.link) {
      entry.author.link = (new URL(entry.author.link, url)).toString()
    }
    if (entry.provider && entry.provider.link) {
      entry.provider.link = (new URL(entry.provider.link, url)).toString()
    }
    if (entry.media) {
      for (const mediaItem of entry.media) {
        mediaItem.thumbnail = (new URL(mediaItem.thumbnail, url)).toString()
        for (const encode of mediaItem.encodes) {
          encode.url = (new URL(encode.url, url)).toString()
        }
      }
    }
  }
  return json
}

export async function writeIndex (searchData: EncodedSearchData, lookupVectorFn?) {
  const exportedColumns: OrthagonalColumns = {
    id: { type: 'string', path: 'id.json' },
    title: { type: 'string', path: 'title.json' },
    words: { type: 'string[]', isVectorIndexed: true, path: 'words.json' },
    link: { type: 'string', path: 'link.json' },
    tags: { type: 'string[]', path: 'tags.json' },
    author: { type: 'object', path: 'author.json' },
    timestamp: { type: 'number', path: 'timestamp.json' }
  }

  // contents of the meta.json
  const indexFile: OrthagonalIndex = {
    buildTimestamp: Date.now(),
    buildID: nanoid(),
    entriesPerShard: 8,
    entries: Object.keys(searchData).length,
    vectorCachePath: 'vectors.lps',
    columns: exportedColumns
  }

  // setup empty arrays for the exports
  const exportDatas = Object.fromEntries(Object.keys(exportedColumns).map(columnName => [columnName, {
    buildID: indexFile.buildID,
    entries: []
  }]))

  const outputFiles = { 'meta.json': JSON.stringify(indexFile) }

  // build the shards and indexes
  chunk(Object.keys(searchData), indexFile.entriesPerShard).forEach((entryIDs, shardNum) => {
    outputFiles[`shard-${shardNum}.json`] = JSON.stringify({
      buildID: indexFile.buildID,
      entries: entryIDs.map(id => {
        const output = { id, ...searchData[id] }
        for (const key in exportedColumns) {
          const value = output[key]
          exportDatas[key].entries.push(value === undefined ? null : value)
        }
        return output
      })
    })
  })

  const uniqueWords: Set<string> = new Set()
  // add word vectors to cache index
  for (const { words } of Object.values(searchData)) {
    for (const word of words) uniqueWords.add(normalizeWord(word))
  }
  const vectorIndex = {}
  // load word vectors in batches
  for (const wordChunk of chunk([...uniqueWords], 10)) {
    await Promise.all(wordChunk.map(async word => {
      const vector = await lookupVectorFn(word)
      if (vector) vectorIndex[word] = vector
    }))
  }

  // export vector cache
  outputFiles['vectors.lps'] = buildVectorShard(vectorIndex)

  for (const key in exportDatas) {
    outputFiles[exportedColumns[key].path] = JSON.stringify(exportDatas[key])
  }

  return outputFiles
}