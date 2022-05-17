import { getUser } from '$lib/models/user'
import { LoginRedirect } from './login'

export async function get ({ locals }) {
  if (!locals.userID) return LoginRedirect
  const user = await getUser(locals.userID)
  delete user.authenticator
  return { body: user}
}