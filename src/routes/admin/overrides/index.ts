import { listOverrides } from "$lib/models/index-override"
import { LoginRedirect } from '../login'

export async function GET ({ locals }) {
  if (!locals.username) return LoginRedirect

  const overrides = await listOverrides()
  return { body: { overrides } }
}