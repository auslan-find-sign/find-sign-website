import { serialize } from 'cookie'

export function GET () {
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