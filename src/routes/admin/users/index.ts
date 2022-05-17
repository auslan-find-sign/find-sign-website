import { listUsers } from '$lib/models/user'
import { LoginRedirect } from '../login'

export async function get ({ locals }) {
  if (!locals.userID) return LoginRedirect
  const users = await listUsers()
  return { body: { users } }
}