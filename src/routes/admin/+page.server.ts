import type { PageServerLoad } from './$types'
import { getUser } from '$lib/models/user'

import { LoginRedirect } from './login/passkey/+server'

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.username) return LoginRedirect
  const user = await getUser(locals.username)
  if (!user) return LoginRedirect
  delete user.authenticators
  user.powers = user.powers || []
  return user
}
