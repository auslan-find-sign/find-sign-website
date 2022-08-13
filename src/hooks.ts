import type { Handle } from '@sveltejs/kit'
import { getSession } from './routes/admin/login'

export const handle: Handle = async function ({ event, resolve }) {
	Object.assign(event.locals, getSession(event))

	return await resolve(event)
}

// expose username in the session object client side
export { getSession } from './routes/admin/login'
