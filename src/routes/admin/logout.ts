import cookie from 'cookie'

export function get () {
  return {
    status: 307,
    headers: {
      'set-cookie': cookie.serialize('token', '', {
        path: '/',
        expires: new Date(0),
        httpOnly: true
      }),
      'location': '/'
    }
  }
}