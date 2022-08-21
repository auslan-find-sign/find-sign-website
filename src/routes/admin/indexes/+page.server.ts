import type { PageServerLoad } from "./$types"
import { userHasPower } from "$lib/models/user"
import { availableIndexes } from "$lib/search/search"
import { LoginRedirect } from "../login/passkey/+server"

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.username) return LoginRedirect
  if (!await userHasPower(locals.username, 'edit-index')) throw new Error('You don’t have the right to edit search index')

  return { availableIndexes }
}