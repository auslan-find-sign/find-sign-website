import { getUser } from '$lib/models/user'
import { LoginRedirect } from './login'

export async function load ({ locals }) {
  console.log(locals)
  if (!locals.username) throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");
  return LoginRedirect
  const user = await getUser(locals.username)
  if (!user) throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");
  return LoginRedirect
  delete user.authenticators
  user.powers = user.powers || []
  return user
}
