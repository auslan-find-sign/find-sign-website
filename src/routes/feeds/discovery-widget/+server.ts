import { json as json$1 } from '@sveltejs/kit';
import { getUpdatesFeed } from '../_read-discovery-feed'
import cache from '$lib/functions/cache'
import type { RequestHandler } from '../$types'

export const prerender = false

// stores old feed output for homepage feed
const cachedFeed = cache(60 * 5)

export const GET: RequestHandler = async ({ url }) => {
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
    body = cachedFeed.set(JSON.stringify(response))
  }

  throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)");
  // Suggestion (check for correctness before using):
  // return json$1(body, {
  //   headers: { 'content-type': 'application/json; charset=UTF-8' }
  // });
  return {
    headers: { 'content-type': 'application/json; charset=UTF-8' },
    body: body
  }
}