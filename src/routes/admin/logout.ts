import { serialize } from 'cookie'

export function GET () {
  return {
    status: 307,
    headers: {
      'set-cookie': serialize('token', '', {
        path: '/',
        expires: new Date(0),
        httpOnly: true
      }),
      'location': '/'
    }
  }
}