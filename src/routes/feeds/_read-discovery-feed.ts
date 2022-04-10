import { base } from '$app/paths'
import { iter_decode } from 'cbor-codec/esm/index.mjs'
import siteConfig from '$lib/site-config.json'

export async function * readUpdateLog (fetch) {
  const response = await fetch(siteConfig.updateLog)
  yield * iter_decode(await response.arrayBuffer())
}

export async function getUpdatesFeed ({ page = 0, length = 30, url, extended = false }) {
  let updates = []
  for await (const entry of readUpdateLog(fetch)) {
    if (entry.available) updates.push(entry)
  }

  updates = updates.sort((a, b) => b.timestamp - a.timestamp)
  updates = updates.slice(length * page, length * (page + 1))

  const version = 'https://jsonfeed.org/version/1.1'

  const title = 'Sign Language Updates'
  const home_page_url = (new URL(base, url)).toString()
  const feed_url = (new URL('?page=0', url)).toString()
  const next_url = updates.length ? (new URL(`?page=${page + 1}`, url)).toString() : null

  return {
    version, title, home_page_url, feed_url, next_url,
    items: updates.map(entry => ({
      id: `${entry.provider}:${entry.id}`,
      title: `${entry.provider} ${entry.verb}: ${[...entry.words].flat(2).join(' ').trim()}`,
      url: (new URL(`/entries/${encodeURIComponent(entry.provider)}/${encodeURIComponent(entry.id)}`, url)).toString(),
      external_url: entry.link,
      authors: [{ name: entry.provider, url: entry.providerLink }],
      date_published: (new Date(entry.timestamp)).toISOString(),
      content_text: `${entry.body}`,
      // TODO: get the videos in here, RSS and Atom theoretically can translate it
      // Before deploy, check json, rss, and atom feeds are all still valid
      // and remember, title must be identical if linking multiple equivilent formats
      attachments: [],
      ...(extended ? {
        __fs_verb: entry.verb,
        __fs_words: entry.words
      } : {})
    }))
  }
}