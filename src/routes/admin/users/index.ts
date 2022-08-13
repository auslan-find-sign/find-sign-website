import { getUser, listUsers } from '$lib/models/user'
import { LoginRedirect } from '../login'

export async function GET ({ locals }) {
  if (!locals.username) return LoginRedirect
  const usernames = await listUsers()
  return { body: { usernames } }
}