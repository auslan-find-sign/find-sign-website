import type { PageServerLoad } from './$types'
import { immediateResponseCache } from '$lib/functions/cache'
import { getSearchLibrary } from '$lib/search/search'

export const load: PageServerLoad = immediateResponseCache(async () => {
  const tagAccumulator = {}
  const userAccumulator = {}

  const libraries = await getSearchLibrary(false, ['tags', 'author'])

  for (const provider in libraries) {
    for (const entry of libraries[provider].entries) {
      for (const tagName of entry.tags) {
        if (!tagAccumulator[tagName]) tagAccumulator[tagName] = 0
        tagAccumulator[tagName] += 1
      }
      if (entry.author && entry.author.id) {
        if (!userAccumulator[entry.author.id]) userAccumulator[entry.author.id] = 0
        userAccumulator[entry.author.id] += 1
      }
    }
  }


  const hashtags = Object.entries(tagAccumulator)
    .map(([hashtag, count]: [string, number]) => ({ hashtag, count }))
    .sort((left, right) => right.count - left.count)
  const usernames = Object.entries(userAccumulator)
    .map(([username, count]: [string, number]) => ({ username, count }))
    .sort((left, right) => right.count - left.count)

  return { hashtags, usernames }
})