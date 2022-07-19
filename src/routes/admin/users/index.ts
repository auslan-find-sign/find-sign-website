import { getUser, listUsers } from '$lib/models/user'
import { LoginRedirect } from '../login'

export async function GET ({ locals }) {
  if (!locals.userID) return LoginRedirect
  const userIDs = await listUsers()
  const users = await Promise.all(userIDs.map(async userID => {
    const user = await getUser(userID)
    return { id: userID, username: user.username }
  }))
  return { body: { users } }
}