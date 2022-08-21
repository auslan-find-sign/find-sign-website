import { decodeFilename } from '$lib/models/filename-codec'
import { availableIndexes } from '$lib/search/search'
import type { ParamMatcher } from '@sveltejs/kit'

export const match: ParamMatcher = (param) => {
  return availableIndexes.includes(decodeFilename(param))
}