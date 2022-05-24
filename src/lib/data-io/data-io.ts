import { createLicense } from '$lib/data-io/auth'
import { stringToBytes } from '$lib/functions/string-encode'
import { encodeBase64 } from 'tweetnacl-ts'
const identity = import.meta.env.VITE_SEARCH_WRITE_IDENTITY
const collectionPath = import.meta.env.VITE_SEARCH_DATA

export type FileInfoJSON = {
  name: string, // filename
  type: string, // inferred mimetype
  size: number, // file size in bytes
  lastModified: string, // time when file was last modified,
  etag: string, // some unique string likely to change when file contents change
  created: string, // time when file was created
  path: string, // full path to file
  isFile: boolean, // is this item a file?
  isFolder: boolean, // is this item a folder?
}

export type BulkWriteFiles = {
  [filePath: string]: string | Uint8Array
}

async function request (path: string, init: RequestInit, ignoreError = false): Promise<Response> {
  const license = createLicense(identity)
  const url = new URL(`${collectionPath}${path}`)
  url.searchParams.set('license', license)
  const response = await fetch(url.toString(), init)

  if (!ignoreError && !response.ok) {
    throw new Error(`${response.status}: ${await response.text()}`)
  }

  return response
}

export async function writeFile (path: string, data: Uint8Array | string): Promise<void> {
  if (typeof data === 'string') {
    data = stringToBytes(data)
  }

  await request(path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/octet-stream' },
    body: data
  })
}

export async function bulkWrite (path: string, files: BulkWriteFiles): Promise<void> {
  await request(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'bulk',
      files: Object.fromEntries(Object.entries(files).map(([filePath, data]) => {
        if (typeof data === 'string') {
          return [filePath, { encoding: 'string', data }]
        } else if (data instanceof Uint8Array) {
          return [filePath, { encoding: 'base64', data: encodeBase64(data) }]
        } else {
          return [filePath, { encoding: 'string', data: JSON.stringify(data) }]
        }
      }))
    })
  })
}

export async function readFile (path: string): Promise<Uint8Array> {
  try {
    const response = await request(path, {})
    return new Uint8Array(await response.arrayBuffer())
  } catch (err) {
    if (err.message.startsWith('404:')) {
      return undefined
    } else {
      throw err
    }
  }
}

export async function exists (path: string): Promise<boolean> {
  const response = await request(path, { method: 'HEAD' }, true)
  return response.status !== 404
}

export async function listFiles (path: string): Promise<FileInfoJSON[]> {
  const response = await request(path, {})
  const { files } = await response.json()
  return files
}

export async function listFilenames (path: string): Promise<string[]> {
  const response = await request(path, { headers: { 'Accept': 'text/plain' } })
  const files = (await response.text()).split('\n')
  return files
}

export async function deletePath (path: string): Promise<void> {
  await request(path, { method: 'DELETE' })
}
