import { userHasPower } from "$lib/models/user"
import { availableIndexes } from "$lib/search/search"
import { LoginRedirect } from "../login"

export async function load ({ locals }) {
  if (!locals.username) throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");
  return LoginRedirect
  if (!await userHasPower(locals.username, 'edit-index')) throw new Error('You don’t have the right to edit search index')

  return { availableIndexes }
}