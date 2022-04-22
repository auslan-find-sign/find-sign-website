// lookup word vectors in precomputed index
import { iter_decode as iterateCBOR } from 'cbor-codec/esm/index.mjs'
import { sha256 } from './hash'
import { bytesToPrefixBits } from './bits'
import { chunkIterable } from './times'
import { unpack } from './packed-vector'
import { build, multiply } from './vector-utilities'

export type VectorLibrary = {
  path: string, // path to folder containing settings.json and shards
  settings: VectorLibrarySettings, // object with config information about the library build and encoding
}

export type VectorLibrarySettings = {
  hashFunction: string,   // currently always sha256 - for good WebAPI compatibility
  vectorSize: number,     // how many dimensions do the vectors have - usually 300
  vectorBits: number,     // how many bits represent each dimension of each vector's numeric value
  buildTimestamp: number, // epoch milliseconds when library was computed
  prefixBits: number,     // how many bits of the hash are used for a shard prefix folder name
  shardBits: number,      // how many bits are overall used for the combo of prefix folder and shard filename
}

export type WordVector = readonly number[]

/**
 * Open precomputed vectors library
 */
export async function open (path: string): Promise<VectorLibrary> {
  const request = await fetch(`${path}/settings.json`, { mode: 'cors', cache: 'force-cache' })
  const settings = await request.json()
  return { path, settings }
}

/**
 * Lookup an open vector library for a specified word, returns either an array of floats (vector) or undefined
 */
export async function lookup (library: VectorLibrary, word: string): Promise<WordVector | undefined> {
  const hash = await sha256(word)
  const folder = parseInt(bytesToPrefixBits(hash, library.settings.prefixBits), 2)
  const file = parseInt(bytesToPrefixBits(hash, library.settings.shardBits), 2)
  // const shard = await readAllCBOR(`${library.path}/shards/${folder}/${file}.cbor`)
  const response = await fetch(`${library.path}/shards/${folder}/${file}.cbor`, { mode: 'cors', cache: 'force-cache' })
  const shard = iterateCBOR(await response.arrayBuffer())
  for (const [entryWord, entryScale, entryPackedVector] of chunkIterable(shard, 3)) {
    if (entryWord === word) {
      const unscaledVector = unpack(entryPackedVector, library.settings.vectorBits, library.settings.vectorSize)
      const scaledVector: WordVector = multiply([unscaledVector], build(entryScale, unscaledVector.length))[0]
      return scaledVector
    }
  }
}
