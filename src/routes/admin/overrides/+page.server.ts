import { listOverrides } from "$lib/models/index-override"
import { LoginRedirect } from '../login'

export async function load ({ locals }) {
  if (!locals.username) throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");
  return LoginRedirect

  const overrides = await listOverrides()
  return { overrides }
}