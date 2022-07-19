import { parse } from "./precomputed-vectors"

export default async function open (path) {
  const response = await fetch(path, { cache: 'no-cache' })
  const buffer = new Uint8Array(await response.arrayBuffer())

  const obj = {}
  for (const { word, getVector} of parse(buffer)) {
    obj[word] = getVector()
  }

  return obj
}
