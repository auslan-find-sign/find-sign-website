import { getUpdatesFeed } from './_read-discovery-feed'
import type { RequestHandler } from './discovery.json.d'

export const prerender = false

export const GET: RequestHandler = async ({ url }) => {
  const page = parseInt(url.searchParams.get('page') || '0')
  const length = parseInt(url.searchParams.get('length') || '50')

  const body = await getUpdatesFeed({ url, page, length })

  return {
    headers: { 'content-type': 'application/feed+json; charset=UTF-8' },
    body: JSON.stringify(body)
  }
}