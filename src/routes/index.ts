import { getUpdatesFeed } from './feeds/_read-discovery-feed'
import cache from '$lib/functions/cache'

export const prerender = false
const maxAge = 60 * 5

// stores old feed output for homepage feed
const cachedFeed = cache(maxAge)

export async function GET ({ url }) {
  let body = cachedFeed.get()
  if (!body) {
    const feed = await getUpdatesFeed({ url, page: 0, length: 20, extended: true })
    const response = feed.items.map(x => ({
      author: x.authors[0],
      verb: x.__fs_verb,
      title: x.__fs_words.join(' '),
      date: x.date_published,
      cacheURL: x.url,
      remoteURL: x.external_url
    }))
    body = cachedFeed.set(response)
  }

  return {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Cache-Control': `max-age=${maxAge}`
    },
    body: { feed: body }
  }
}