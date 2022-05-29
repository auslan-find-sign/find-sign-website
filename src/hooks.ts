import cookie from 'cookie'
import type { Handle, GetSession } from '@sveltejs/kit'
import { verifyToken } from '$lib/../routes/admin/login'

export const handle: Handle = async function ({ event, resolve }) {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '')

	// verify and parse login cookie tokens if user is passkey logged in
	if (cookies.token) {
		const userID = verifyToken(cookies.token)
		if (typeof userID === 'string') {
			event.locals.userID = userID
		}
	}

	return await resolve(event)
}

// expose userID in the session object client side
export const getSession: GetSession = function getSession (event) {
  return {
		userID: event.locals.userID || undefined
	}
}
