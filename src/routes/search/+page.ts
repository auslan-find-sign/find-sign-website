import { redirect } from '@sveltejs/kit';
import { getSearchLibrary, search, type SearchResult } from '$lib/search/search'

const resultsPerPage = 10
const maxPages = 9

const uri = encodeURIComponent

	/** @type {import('./search').PageLoad} */
export async function load ({ url }) {
  const query = url.searchParams.get('query') || ''
  const page = parseInt(url.searchParams.get('page') || '0')
  const region = url.searchParams.get('r')

  // empty queries go home!
  if (query.trim() === '') throw redirect(301, '/');

  let actualQuery = region ? `#${region} (${query})` : query
  const { results, totalResults } = await search(actualQuery, page * resultsPerPage, resultsPerPage)
  const totalPages = Math.min(maxPages, Math.ceil(totalResults / resultsPerPage))

  return {
  query,
  page,
  results,
  totalPages,
  region: region || false,
  viewport: url.searchParams.get('vp') === 'm' ? 'mobile' : 'desktop'
}
}
