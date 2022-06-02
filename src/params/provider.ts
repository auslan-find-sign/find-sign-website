import { decodeFilename } from '$lib/models/filename-codec'
import { availableIndexes } from '$lib/search/search'

/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param): boolean {
  return availableIndexes.includes(decodeFilename(param))
}