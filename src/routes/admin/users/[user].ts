import { deleteUser, getUser, setUser, userHasPower } from '$lib/models/user'
import { LoginRedirect } from '../login'

export async function GET ({ locals, params }) {
  if (!locals.username) return LoginRedirect
  const canEdit = await userHasPower(locals.username, 'edit-users')
  const user = await getUser(params.user)
  return { body: { username: params.user, user, canEdit } }
}

export async function PUT ({ locals, request, params }) {
  if (!locals.username) return LoginRedirect
  if (!await userHasPower(locals.username, 'edit-users')) throw new Error('You don’t have the right to edit users')
  const user = await getUser(params.user)
  const body = await request.json()
  const updated = { ...user, ...body }
  await setUser(params.user, updated)
  delete updated.authenticator
  return { body: updated }
}

export async function DELETE ({ locals, params }) {
  if (!locals.username) return LoginRedirect
  if (!await userHasPower(locals.username, 'edit-users')) throw new Error('You don’t have the right to edit users')
  await deleteUser(params.user)
  return { body: { success: true } }
}