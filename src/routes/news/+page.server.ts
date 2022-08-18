import readFeed from "$lib/data-io/rss"

export async function load ({}) {
  const feed = await readFeed(import.meta.env.VITE_NEWS_RSS)

  return { feed }
}