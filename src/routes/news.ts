import readFeed from "$lib/data-io/rss"

export async function GET ({}) {
  const feed = await readFeed(import.meta.env.VITE_NEWS_RSS)

  return {
    body: { feed }
  }
}