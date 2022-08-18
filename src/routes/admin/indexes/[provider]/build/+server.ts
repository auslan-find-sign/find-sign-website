import { json } from '@sveltejs/kit';
import { writeAuditLog, type AuditExtraData } from '$lib/models/audit-log'
import { fn } from '$lib/models/filename-codec'
import { userHasPower } from '$lib/models/user'
import buildSearchIndex from '$lib/orthagonal/build'
import { createProgressLog, nextUpdate } from '$lib/progress/progress-log'
import { LoginRedirect } from '../../../login'

/** long polling endpoint for progress and log streaming from the post endpoints long running output */
export async function GET ({ url }) {
  const update = await nextUpdate(url.searchParams.get('id'), parseInt(url.searchParams.get('index')))
  throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)");
  // Suggestion (check for correctness before using):
  // return json(update);
  return { body: update }
}

/** endpoint for manually rebuilding search index, e.g. after authoring an index override */
export async function POST ({ locals, params, url }) {
  if (!locals.username) throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)");
  return LoginRedirect
  if (!await userHasPower(locals.username, 'edit-index')) throw new Error('You don’t have the right to edit search index')
  const fast = !!url.searchParams.has('fast')

  const auditExtra: AuditExtraData = {
    publicURL: fn`/sign/${params.provider}`,
    adminURL: `/admin/indexes/${encodeURIComponent(params.provider)}`,
    index: params.provider,
  }
  if (fast) {
    await writeAuditLog(locals.username, 'update-index', `Quick rebuilt "${params.provider}" index`, auditExtra)
  } else {
    await writeAuditLog(locals.username, 'rebuild-index', `Deep rebuilt "${params.provider}" index`, auditExtra)
  }

  const progress = createProgressLog(async ({ log, progress }) => {
    await buildSearchIndex(params.provider, { log, progress, fast })
  })

  return json({ progress })
}