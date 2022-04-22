import siteConfig from '$lib/site-config.json'
import { open, getProviders, getProviderIDs } from '$lib/search/search-index'
import uri from 'uri-tag'

const staticPages = [
  '/',
  '/about',
  '/technology',
  '/random',
  '/feeds/discovery.atom',
  '/feeds/discovery.json',
  '/feeds/discovery.rss',
]

export async function get({ url }) {
  const data = []

  data.push('<?xml version="1.0" encoding="UTF-8" ?>')
  data.push('<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">')

  for (const path of staticPages) {
    data.push('<url>')
    data.push(`<loc>${new URL(path, url)}</loc>`)
    data.push('</url>')
  }

  const library = await open(siteConfig.searchIndex)
  for (const provider of await getProviders(library)) {
    for (const id of await getProviderIDs(library, provider)) {
      // TODO: proper url encoding
      data.push('<url>')
      data.push(`<loc>${new URL(uri`/sign/${provider}/${id}`, url)}</loc>`)
      data.push('</url>')
    }
  }

  data.push('</urlset>')


  return {
    headers: {
      'Content-Type': 'application/xml'
    },
    body: data.join('\n')
  }
}