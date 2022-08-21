import { listOverrides } from "$lib/models/index-override"
import { LoginRedirect } from '../login/passkey/+server'

export async function load ({ locals }) {
  if (!locals.username) return LoginRedirect

  const overrides = await listOverrides()
  return { overrides }
}