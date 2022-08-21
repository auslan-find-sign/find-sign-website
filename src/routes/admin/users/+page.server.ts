import { getUser, listUsers } from '$lib/models/user'
import { LoginRedirect } from '../login/passkey/+server'

export async function load ({ locals }) {
  if (!locals.username) return LoginRedirect
  const usernames = await listUsers()
  return { usernames }
}