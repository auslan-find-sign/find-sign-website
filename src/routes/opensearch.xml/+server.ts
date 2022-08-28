import type { RequestHandler} from './$types'
import { encode } from 'pigeonmark-xml'

function rel(base, path) {
  return new URL(path, base).toString()
}

export const GET: RequestHandler = async ({url}) => {
  const xml =
    ['OpenSearchDescription', { xmlns: 'http://a9.com/-/spec/opensearch/1.1/' },
      ['ShortName', 'Find Sign'],
      ['LongName', 'Search Find Sign'],
      ['Description', `Look up Auslan vocab and phrase examples using ${url.hostname}`],
      ['InputEncoding', 'UTF-8'],
      ['OutputEncoding', 'UTF-8'],
      ['AdultContent', 'false'],
      ['Image', { width: '128', height: '128', type: 'image/png' }, rel(url, '/favicon-128.png')],
      ['Url', { type: 'text/html', method: 'get', template: rel(url, '/search?query={searchTerms}') }],
      ['Url', { type: 'application/opensearchdescription+xml', rel: 'self', template: rel(url, '/opensearch.xml') }]
    ]
  return new Response(encode(xml), { headers: { 'Content-Type': 'application/xml' } })
}
