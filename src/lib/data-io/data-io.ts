import { createLicense } from '$lib/data-io/auth'
import { stringToBytes } from '$lib/functions/string-encode'
const identity = import.meta.env.VITE_DATA_IDENTITY
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

export async function readFile (path: string): Promise<Uint8Array> {
  const response = await request(path, {})
  return new Uint8Array(await response.arrayBuffer())
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
