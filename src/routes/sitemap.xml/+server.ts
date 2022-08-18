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
  const data = []

  data.push('<?xml version="1.0" encoding="UTF-8" ?>')
  data.push('<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">')

  for (const path of staticPages) {
    data.push('<url>')
    data.push(`<loc>${new URL(path, url)}</loc>`)
    data.push('</url>')
  }

  data.push('<url>')
  data.push(`<loc>${new URL(fn`/sign/`, url)}</loc>`)
  data.push('</url>')

  const libraries = await getSearchLibrary(availableIndexes, ['id'])

  for (const index of await availableIndexes) {
    data.push('<url>')
    data.push(`<loc>${new URL(fn`/sign/${index}`, url)}</loc>`)
    data.push('</url>')

    for (const { id } of libraries[index].entries) {
      // TODO: proper url encoding
      data.push('<url>')
      data.push(`<loc>${new URL(fn`/sign/${index}/${id}`, url)}</loc>`)
      data.push('</url>')
    }
  }

  data.push('</urlset>')


  throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)");
  // Suggestion (check for correctness before using):
  // return new Response(data.join('\n'), {
  //   headers: {
  //     'Content-Type': 'application/xml'
  //   }
  // });
  return {
    headers: {
      'Content-Type': 'application/xml'
    },
    body: data.join('\n')
  }
}