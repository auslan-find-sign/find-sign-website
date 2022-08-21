import { fn } from '$lib/models/filename-codec'
import { getSearchLibrary, availableIndexes } from '$lib/search/search'

const staticPages = [
  '/',
  '/about',
  '/technology',
  '/random',
  '/feeds/discovery.atom',
  '/feeds/discovery.json',
  '/feeds/discovery.rss',
]

export async function GET ({ url }) {
  const indexes = [...availableIndexes]
  return new Response(new ReadableStream({
    start (controller) {
      controller.enqueue('<?xml version="1.0" encoding="UTF-8" ?>\n')
      controller.enqueue('<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">\n')

      for (const path of staticPages) {
        controller.enqueue(`<url><loc>${new URL(path, url)}</loc></url>\n`)
      }

      controller.enqueue(`<url><loc>${new URL(fn`/sign/`, url)}</loc></url>\n`)
    },
    async pull (controller) {
      if (indexes.length > 0) {
        const index = indexes.shift()
        controller.enqueue(`<url><loc>${new URL(fn`/sign/${index}`, url)}</loc></url>\n`)

        const libraries = await getSearchLibrary([index], ['id'])
        const lib = libraries[index]

        for (const { id } of lib.entries) {
          controller.enqueue(`<url><loc>${new URL(fn`/sign/${index}/${id}`, url)}</loc></url>\n`)
        }
      } else {
        controller.enqueue('</urlset>\n')
        controller.close()
      }
    }
  }), { headers: { 'Content-Type': 'application/xml' } })
}