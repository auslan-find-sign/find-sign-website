import { open } from '$lib/search/search-index'
import cache from '$lib/functions/cache'

const cached = cache(60 * 60)

export async function get () {
  if (cached.get()) {
    return cached.get()
  } else {
    const tagAccumulator = {}
    const library = await open(import.meta.env.VITE_SEARCH_INDEX)

    for (const entry of library.index) {
      for (const tagName of entry.tags) {
        if (!tagAccumulator[tagName]) tagAccumulator[tagName] = 0
        tagAccumulator[tagName] += 1
      }
    }

    const hashtags = Object.entries(tagAccumulator)
      .map(([hashtag, count]: [string, number]) => ({ hashtag, count }))
      .sort((left, right) => right.count - left.count)

    return cached.set({
      body: { hashtags }
    })
  }
}