import { userHasPower } from "$lib/models/user"
import { LoginRedirect } from "../login"

export async function get ({ locals }) {
  if (!locals.userID) return LoginRedirect
  if (!await userHasPower(locals.userID, 'edit-index')) throw new Error('You don’t have the right to edit search index')

  const providers = import.meta.env.VITE_SEARCH_INDEXES.split(',')
  return { body: { providers }}
}