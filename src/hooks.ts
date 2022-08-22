import type { Handle } from '@sveltejs/kit'
import { getSession } from './routes/admin/login/passkey/+server'

export const handle: Handle = async function ({ event, resolve }) {
	Object.assign(event.locals, getSession(event))

	return await resolve(event)
}
