// lookup word vectors in precomputed index
import { sha256 } from './hash'
import { bytesToPrefixBits } from './bits'
import { chunkIterable } from './times'
import { unpack } from './packed-vector'
import { build, multiply } from './vector-utilities'
import { iterateLengthPrefixed } from '$lib/functions/iters'
import { bytesToString } from '$lib/functions/string-encode'

export type VectorLibrary = {
  path: string, // path to folder containing settings.json and shards
  settings: VectorLibrarySettings, // object with config information about the library build and encoding
}

export type VectorLibrarySettings = {
  version: 5,
  shardBits: number, // normally around 13-14
  entries: number, // normally 500k
  vectorSize: number, // usually 300 with fasttext
  source: string, // url to fasttext vec text format dataset this derives from
  built: string, // iso timestamp string for when build was done
}

export type WordVector = readonly number[]

/**
 * Open precomputed vectors library
 */
export async function open (path: string): Promise<VectorLibrary> {
  const request = await fetch(`${path}/info.json`, { mode: 'cors', cache: 'force-cache' })
  const settings = await request.json()
  return { path, settings }
}

/**
 * Lookup an open vector library for a specified word, returns either an array of floats (vector) or undefined
 */
export async function lookup (library: VectorLibrary, word: string): Promise<WordVector | undefined> {
  const hash = await sha256(word)
  const bucket = parseInt(bytesToPrefixBits(hash, library.settings.shardBits), 2)
  const response = await fetch(`${library.path}/${bucket}.lps`, { mode: 'cors', cache: 'force-cache' })
  const buffer = new Uint8Array(await response.arrayBuffer())
  const entries = chunkIterable(iterateLengthPrefixed(buffer), 3)
  for await (const [wordBuffer, scaleBuffer, entryPackedVector] of entries) {
    const entryWord = bytesToString(wordBuffer)
    if (entryWord === word) {
      const scaleDataView = new DataView(scaleBuffer.buffer, scaleBuffer.byteOffset, scaleBuffer.byteLength)
      const entryScale = scaleDataView.getFloat32(0)
      const scaledVector = [...entryPackedVector].map(x =>
        (((x / 255) * 2.0) - 1.0) * entryScale
      )
      return scaledVector
    }
  }
}
