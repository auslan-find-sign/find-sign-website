import { deleteUser, getUser, setUser, userHasPower } from '$lib/models/user'
import { LoginRedirect } from '../login'

export async function GET ({ locals, params }) {
  if (!locals.userID) return LoginRedirect
  const user = await getUser(params.user)
  delete user.authenticator
  return { body: { ...user, canEdit: await userHasPower(locals.userID, 'edit-users') } }
}

export async function PUT ({ locals, request, params }) {
  if (!locals.userID) return LoginRedirect
  if (!await userHasPower(locals.userID, 'edit-users')) throw new Error('You don’t have the right to edit users')
  const user = await getUser(params.user)
  const body = await request.json()
  const updated = { ...user, ...body }
  await setUser(params.user, updated)
  delete updated.authenticator
  return { body: updated }
}

export async function DELETE ({ locals, params }) {
  if (!locals.userID) return LoginRedirect
  if (!await userHasPower(locals.userID, 'edit-users')) throw new Error('You don’t have the right to edit users')
  await deleteUser(params.user)
  return { body: { success: true } }
}