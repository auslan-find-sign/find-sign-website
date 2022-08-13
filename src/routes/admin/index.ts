import { getUser } from '$lib/models/user'
import { LoginRedirect } from './login'

export async function GET ({ locals }) {
  console.log(locals)
  if (!locals.username) return LoginRedirect
  const user = await getUser(locals.username)
  if (!user) return LoginRedirect
  delete user.authenticators
  user.powers = user.powers || []
  return { body: user }
}
