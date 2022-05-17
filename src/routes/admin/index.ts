import { getUser } from "$lib/models/user"

export async function get ({ locals, request }) {
  if (!locals.userID) {
    return {
      status: 307,
      headers: {
        location: '/admin/login'
      }
    }
  }

  const user = await getUser(locals.userID)
  return { body: { user }}
}