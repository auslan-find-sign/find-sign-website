import { getUser, setUser } from '$lib/models/user'
import { LoginRedirect } from './login'

export async function get ({ locals }) {
  if (!locals.userID) return LoginRedirect
  const user = await getUser(locals.userID)
  delete user.authenticator
  return { body: user}
}

export async function post ({ locals, request }) {
  if (!locals.userID) return LoginRedirect
  const body = await request.json()
  const user = await getUser(locals.userID)
  user.username = body.username
  await setUser(locals.userID, user)
  return { body: { success: true }}
}