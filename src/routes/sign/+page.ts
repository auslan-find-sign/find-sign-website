import { availableIndexes } from '$lib/search/search'

export async function load () {
  return {
  indexes: availableIndexes
}
}
