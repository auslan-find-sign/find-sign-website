import { decodeFilename } from '$lib/models/filename-codec'
import buildSearchIndex from '$lib/orthagonal/build'

const IndexName = import.meta.env.VITE_SEARCH_INDEX_NAME

/** endpoint for cron-like tasks to automatically rebuild orthagonal indexes after encoder has done it's work */
export async function GET ({ url, params }) {
  if (url.searchParams.get('key') !== import.meta.env.VITE_AUTOMATION_KEY) return { status: 400, body: 'needs automation key query string param' }

  const provider = decodeFilename(params.provider)

  // stream the response back with realtime logging and progress updates as a chunked response
  return {
    headers: { 'Content-Type': 'text/plain' },
    body: new ReadableStream({
      async start (controller) {
        let lastProgress = 0.0
        const progress = (num) => {
          if (num > lastProgress + 0.05 || num === 1.0) {
            controller.enqueue(`Progress: ${Math.round(num * 100)}%\n`)
            lastProgress = Math.round(num * 100) / 100
          }
        }
        const log = (...args) => {
          controller.enqueue(args.join(' ') + '\n')
        }

        await buildSearchIndex(provider, { log, progress, fast: true })

        controller.close()
      }
    })
  }
}