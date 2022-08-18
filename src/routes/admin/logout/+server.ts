import { serialize } from 'cookie'

export function GET () {
  throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)");
  return {
    status: 307,
    headers: {
      'Set-Cookie': serialize('token', '', {
        path: '/',
        expires: new Date(2000, 0, 1),
        httpOnly: true
      }),
      'Location': '/'
    }
  }
}