export type OrthagonalIndex = {
  buildTimestamp: number, // epochMs
  buildID: string, // unique id which changes whenever the data is rebuilt
  vectorCachePath?: string, // [relative] url to a precomputed vectors shard file containing vectors
  entriesPerShard: number, // modulus number for calculating shard file from index
  entries: number, // total number of entries
  columns: OrthagonalColumns
}

export type OrthagonalColumns = {
  [key: string]: OrthagonalColumnSpec
}

export type OrthagonalColumnSpec = {
  path: string, // path relative to location of orthagonal index file, to this column
  type: 'number' | 'number[]' | 'string' | 'string[]' | 'object'
  isVectorIndexed?: true, // for string types, are the strings included in the vectorCachePath
}

export type OrthagonalColumnData = {
  buildID: string, // unique ID which matches the buildID in the OrthagonalIndex
  entries: any[], // entries in this column
}

export type EncodedSearchData = { [key: string]: EncodedSearchDataEntry }

export type EncodedSearchDataEntry = {
  id?: string, // id of entry, used when in array form instead of object form
  title: string, // human friendly entry title
  words: string[], // human friendly list of searchable words
  link?: string, // url to page about this sign
  nav?: SearchDataNavEntry[], // breadcrumbs in to site
  body: string, // markdown-like text body
  media: SearchDataEncodedMedia[], // videos for the carousel
  tags: string[], // hashtags
  provider: {
    id: string, // url component sort of label like auslan-signbank
    name: string, // friendly name for site
    verb?: string, // discovery verb, e.g. 'shared' or 'documented'
    link?: string, // link to provider
  },
  author?: {
    id?: string, // like a username on social media etc, string with tag-like character rules
    name?: string, // name of author
    link?: string, // link to author's profile
    avatar?: string, // link to a square avatar image
  },
  timestamp?: number, // epochMs
}

export type SearchDataNavEntry = [title: string, url: string]

export type SearchDataEncodedMedia = {
  type: 'video' | 'audio',
  source: { 'method': 'fetch', url: string, clipping?: { start?: number, end?: number}, version: string },
  timestamp: number, // epochMs time when oldest video transcode was made
  thumbnail: string, // string url to a thumbnail in a web compatible image format like webp or jpeg
  encodes: SearchDataEncode[], // each version of the same video source
}

export type SearchDataEncode = {
  type: 'video/mp4' | 'video/webm' | 'video/x-matroska',
  width: number, // video actual width in pixels
  height: number, // video actual height in pixels,
  container: 'mp4' | 'webm' | 'mkv',
  codec: 'x264' | 'x265' | 'vp8' | 'vp9' | 'av1',
  version: string, // media invalidation string, used internally by encoder, e.g. "mp4:x264:22@512x288"
  url: string, // relative path to video file, e.g. "auslan-signbank-media/BOY.NTH-0-x264-512x288.mp4"
  byteSize: number, // size in bytes
  duration: number, // duration in seconds
}