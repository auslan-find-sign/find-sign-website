import { listOverrides } from "$lib/models/index-override"
import { LoginRedirect } from '../login'

export async function get ({ locals }) {
  if (!locals.userID) return LoginRedirect

  const overrides = await listOverrides()
  return { body: { overrides } }
}