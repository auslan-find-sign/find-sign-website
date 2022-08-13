import { listAuditLogs, readAuditLog } from "$lib/data-io/audit-log"
import type { RequestHandler } from "@sveltejs/kit"

const EntriesPerPage = 50

export const GET: RequestHandler = async function GET ({ url }) {
  const auditLogs = (await listAuditLogs()) || []
  const totalLogs = auditLogs.length
  const totalPages = Math.ceil(totalLogs / EntriesPerPage)
  const currentPage = parseInt(url.searchParams.get('page') || '0')
  const pageEntries = await Promise.all(auditLogs
    .slice(currentPage * EntriesPerPage, (currentPage + 1) * EntriesPerPage)
    .map(readAuditLog)
  )

  return {
    body: {
      pageEntries,
      currentPage,
      totalPages
    }
  }
}