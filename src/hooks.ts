import cookie from 'cookie'
import { v4 as uuid } from '@lukeed/uuid'
import type { Handle } from '@sveltejs/kit'
import { verifyToken } from '$lib/../routes/admin/login'

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '')

	// verify and parse login cookie tokens if user is passkey logged in
	if (cookies.token) {
		const userID = verifyToken(cookies.token)
		if (typeof userID === 'string') {
			event.locals.userID = userID
		}
	}

	return await resolve(event)
};
