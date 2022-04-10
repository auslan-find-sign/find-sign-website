import * as searchIndex from '$lib/search/search-index'
import siteConfig from '$lib/site-config.json'

export async function get ({ params }) {
  const library = await searchIndex.open(siteConfig.searchIndex)
  const result = await searchIndex.getResultByPath(library, params.provider, params.id)
  return { body: { result } }
}