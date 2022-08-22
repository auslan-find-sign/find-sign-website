import type { LayoutServerLoad } from "./$types"
// import { getSession } from "./admin/login/passkey/+server"

export const load: LayoutServerLoad = (event) => {
  return {
    session: {
      username: event.locals.username
    }
  }
}