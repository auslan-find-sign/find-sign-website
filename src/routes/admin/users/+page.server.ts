import { getUser, listUsers } from '$lib/models/user'
import { LoginRedirect } from '../login'

export async function load ({ locals }) {
  if (!locals.username) throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");
  return LoginRedirect
  const usernames = await listUsers()
  return { usernames }
}