import { listAuditLogs, readAuditLog } from "$lib/data-io/audit-log"
import type { RequestHandler } from "@sveltejs/kit"

const FeedEntries = 50

export const GET: RequestHandler = async function GET ({ url }) {
  const auditLogs = (await listAuditLogs()) || []
  const pageEntries = await Promise.all(auditLogs.slice(0, FeedEntries).map(readAuditLog))

  return {
    body: {
      version: 'https://jsonfeed.org/version/1.1',
      title: `Admin Audit Log for ${url.origin}`,
      home_page_url: (new URL('/', url)).toString(),
      feed_url: url.toString(),
      items: pageEntries.map(entry => {
        return {
          id: `${entry.time.getTime()}-${entry.actionType}-${entry.actor}`,
          content_text: `${entry.actor} performed a ${entry.actionType} action: ${entry.message}`,
          title: `${entry.actor} performed ${entry.actionType}`,
          date_published: entry.time.toISOString(),
          url: entry.extra ? entry.extra.publicURL : undefined,
          author: { id: entry.actor },
          authors: [{ id: entry.actor }],
          tags: [entry.actionType]
        }
      })
    }
  }
}