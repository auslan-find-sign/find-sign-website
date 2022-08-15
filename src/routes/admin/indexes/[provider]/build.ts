import { writeAuditLog } from '$lib/models/audit-log'
import { userHasPower } from '$lib/models/user'
import buildSearchIndex from '$lib/orthagonal/build'
import { createProgressLog, nextUpdate } from '$lib/progress/progress-log'
import { LoginRedirect } from '../../login'

/** long polling endpoint for progress and log streaming from the post endpoints long running output */
export async function GET ({ url }) {
  const update = await nextUpdate(url.searchParams.get('id'), parseInt(url.searchParams.get('index')))
  return { body: update }
}

/** endpoint for manually rebuilding search index, e.g. after authoring an index override */
export async function POST ({ locals, params, url }) {
  if (!locals.username) return LoginRedirect
  if (!await userHasPower(locals.username, 'edit-index')) throw new Error('You don’t have the right to edit search index')
  const fast = !!url.searchParams.has('fast')

  if (fast) {
    await writeAuditLog(locals.username, 'update-index', `Quick updated ${params.provider} index`, { index: params.provider })
  } else {
    await writeAuditLog(locals.username, 'rebuild-index', `Deep rebuilt ${params.provider} index`, { index: params.provider })
  }

  const progress = createProgressLog(async ({ log, progress }) => {
    await buildSearchIndex(params.provider, { log, progress, fast })
  })

  return { body: { progress } }
}