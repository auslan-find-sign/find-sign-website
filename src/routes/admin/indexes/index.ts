import { userHasPower } from "$lib/models/user"
import { availableIndexes } from "$lib/search/search"
import { LoginRedirect } from "../login"

export async function GET ({ locals }) {
  if (!locals.userID) return LoginRedirect
  if (!await userHasPower(locals.userID, 'edit-index')) throw new Error('You don’t have the right to edit search index')

  return { body: { availableIndexes }}
}