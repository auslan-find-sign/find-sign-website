import { getUpdatesFeed } from './feeds/_read-discovery-feed'
import cache from '$lib/functions/cache'
import readFeed from '$lib/data-io/rss'

export const prerender = false
const maxAge = 60 * 5

const feedEntries = 20

// stores old feed output for homepage feed
const cachedFeed = cache(maxAge)

export async function GET ({ url }) {
  let body = cachedFeed.get()
  if (!body) {
    const [searchFeed, rssFeed] = await Promise.all([
      getUpdatesFeed({ url, page: 0, length: feedEntries, extended: true }),
      (async function () {
        try {
          return await readFeed(import.meta.env.VITE_NEWS_RSS)
        } catch (err) {
          console.error('Homepage blog feed failed to load', err)
          return []
        }
      })()
    ])
    const response = [...searchFeed.items.map(x => ({
      author: x.authors[0],
      verb: x.__fs_verb,
      title: x.__fs_words.join(' '),
      date: x.date_published,
      cacheURL: x.url,
      remoteURL: x.external_url
    })).reverse(), ...rssFeed.map(entry => ({
      author: { name: 'Find Sign' },
      verb: 'blogged',
      title: entry.title || 'an update about the site',
      date: (new Date(entry.pubDate)).toISOString(),
      remoteURL: entry.link,
    }))].sort((x, y) => Date.parse(x.date) - Date.parse(y.date)).slice(-feedEntries)
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