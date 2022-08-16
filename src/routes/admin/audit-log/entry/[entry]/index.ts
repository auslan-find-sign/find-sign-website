import { readAuditLog } from "$lib/models/audit-log"

export async function GET ({ params }) {
  const filename = params.entry
  const entry = await readAuditLog({ filename })
  return { body: { entry } }
}