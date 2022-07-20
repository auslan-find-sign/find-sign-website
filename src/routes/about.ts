import cache from '$lib/functions/cache'
import { getSearchLibrary } from '$lib/search/search'

const maxAge = 60 * 60 // 1 hour
const cached = cache(maxAge)

export async function GET () {
  if (cached.get()) {
    return cached.get()
  } else {
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

    return cached.set({
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Cache-Control': `max-age=${maxAge}`
      },
      body: { hashtags, usernames }
    })
  }
}