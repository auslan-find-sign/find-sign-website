import { writeAuditLog } from '$lib/models/audit-log'
import { deleteUser, getUser, setUser, userHasPower } from '$lib/models/user'
import { LoginRedirect } from '../../login'

export async function load ({ locals, params }) {
  if (!locals.username) throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");
  return LoginRedirect
  const canEdit = await userHasPower(locals.username, 'edit-users')
  const user = await getUser(params.user)
  return { username: params.user, user, canEdit }
}

export async function PUT ({ locals, request, params }) {
  if (!locals.username) throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");
  return LoginRedirect
  if (!await userHasPower(locals.username, 'edit-users')) throw new Error('You don’t have the right to edit users')
  const user = await getUser(params.user)
  const body = await request.json()
  const updated = { ...user, ...body }
  await writeAuditLog(locals.username, 'edit-user', `Edited account for user "${params.user}"`, {
    subjectUser: params.user,
    object: body
  })
  await setUser(params.user, updated)
  throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");
  return { body: updated }
}

export async function DELETE ({ locals, params }) {
  if (!locals.username) throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");
  return LoginRedirect
  if (!await userHasPower(locals.username, 'edit-users')) throw new Error('You don’t have the right to edit users')
  await writeAuditLog(locals.username, 'delete-user', `Deleted account for user "${params.user}"`, { subjectUser: params.user })
  await deleteUser(params.user)
  throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");
  return { body: { success: true } }
}