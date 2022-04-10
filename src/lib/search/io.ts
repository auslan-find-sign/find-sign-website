import { decode as decodeCBOR, iter_decode as iterateCBOR } from 'cbor-codec/esm/index.mjs'
export { decodeCBOR, iterateCBOR }

/**
 * Given a url/path, read the resource and decode it as CBOR
 */
export async function readCBOR (url: string | URL): Promise<any> {
  const response = await globalThis.fetch(`${url}`)
  const arrayBuffer = await response.arrayBuffer()
  return decodeCBOR(arrayBuffer)
}

/**
 * Given a url/path, read the resource and decodes it as an async iterable
 * @returns {Array}
 */
export async function readAllCBOR (url: string | URL): Promise<any[]> {
  const response = await fetch(`${url}`)
  const arrayBuffer = await response.arrayBuffer()
  return [...iterateCBOR(arrayBuffer)]
}

/**
 * Given a url/path, read the resource and decode it as JSON
 * @param {string} url
 * @returns {any}
 */
export async function readJSON (url: string | URL): Promise<any> {
  const response = await fetch(`${url}`)
  return await response.json()
}
