import { decode, encodeUrl as encode } from '@borderless/base64'
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server'
import { createUser, getUser, setUser } from '$lib/models/user'
import { stringToBytes, bytesToString } from '$lib/functions/string-encode'
import { sign, sign_keyPair, sign_keyPair_fromSecretKey, sign_open } from 'tweetnacl-ts'
import { hexToByteArray } from '$lib/functions/hex-encode'
import cookie from 'cookie'

const ServerKeypair = sign_keyPair_fromSecretKey(
  import.meta.env.VITE_PASSKEY_CHALLENGE_SECRET
    ? hexToByteArray(import.meta.env.VITE_PASSKEY_CHALLENGE_SECRET)
    : sign_keyPair().secretKey
)

// Human-readable title for your website
const rpName = 'Find Sign'
// A unique identifier for your website
// const rpID = 'localhost'
// The URL at which registrations and authentications should occur
// const origin = `https://${rpID}`

const ChallengeTimeout = 1000 * 60 * 5 // 5 mins
const LoginDuration = 1000 * 60 * 60 * 6 // 6 hours

function generateToken (data: string, expiry: number) {
  const obj = [data, expiry]
  return encode(sign(stringToBytes(JSON.stringify(obj)), ServerKeypair.secretKey))
}

// returns data string, if the token is valid
// used to sign tokens, but also to make login cookies
export function verifyToken (token) {
  const unboxed = sign_open(decode(token), ServerKeypair.publicKey)
  if (!unboxed) return undefined
  const obj = JSON.parse(bytesToString(unboxed))
  if (!obj || obj[1] < Date.now()) return undefined
  return obj[0]
}

export const LoginRedirect = {
  status: 307,
  headers: {
    location: '/admin/login'
  }
}

// webauthn endpoint
export const post = async function post ({ request }: { request: Request }) {
  const req = await request.json()
  const url = new URL(request.url)

  if (req.type === 'start-registration') {
    const opts = generateRegistrationOptions({
      rpName,
      rpID: url.hostname,
      userID: 'user account',
      userName: 'user account',
      ...req.opts
    })
    return { body: opts }
  } else if (req.type === 'store-registration') {
    try {
      /** @ts-ignore */
      const { verified, registrationInfo } = await verifyRegistrationResponse({
        credential: req.credential,
        expectedChallenge: req.challenge,
        expectedOrigin: url.origin,
        expectedRPID: url.hostname,
      })
      if (verified === true) {
        console.log('registrationInfo', registrationInfo)
        await createUser(registrationInfo)
        const cookieExpiry = Date.now() + LoginDuration
        const loginToken = generateToken(encode(registrationInfo.credentialID), cookieExpiry)
        return {
          headers: {
            'set-cookie': cookie.serialize('token', loginToken, {
              path: '/',
              expires: new Date(cookieExpiry),
              httpOnly: true
            })
          },
          body: { verified, id: encode(registrationInfo.credentialID) }
        }
      } else {
        return { status: 400, body: 'verification failed' }
      }
    } catch (error) {
      return { status: 400, body: error.message }
    }
  } else if (req.type === 'start-login') {
    const options = generateAuthenticationOptions({
      allowCredentials: [],
      userVerification: 'preferred',
      timeout: ChallengeTimeout
    })
    const token = generateToken(options.challenge, Date.now() + ChallengeTimeout)
    return {
      body: { options, token }
    }
  } else if (req.type === 'complete-login') {
    const challenge = verifyToken(req.token)
    if (!challenge) return { status: 400, body: { error: 'Challenge Token Invalid' } }
    const user = await getUser(req.credential.rawId)
    if (!user) return { status: 400, body: { error: 'User is not known to server' } }
    try {
      const { verified, authenticationInfo } = await verifyAuthenticationResponse({
        credential: req.credential,
        expectedChallenge: challenge,
        expectedOrigin: url.origin,
        expectedRPID: url.hostname,
        authenticator: {
          counter: user.authenticator.counter,
          credentialPublicKey: Buffer.from(user.authenticator.credentialPublicKey),
          credentialID: Buffer.from(user.authenticator.credentialID)
        }
      })

      if (verified) {
        console.log('authenticationInfo', authenticationInfo)

        // update user's authentication counter - some keyfobs require this for security
        await setUser(req.credential.rawId, {
          ...user,
          authenticator: {
            ...user.authenticator,
            counter: authenticationInfo.newCounter
          }
        })

        // set a cookie so the user can stay logged in
        const cookieExpiry = Date.now() + LoginDuration
        const loginToken = generateToken(user.id, cookieExpiry)
        return {
          headers: {
            'set-cookie': cookie.serialize('token', loginToken, {
              path: '/',
              expires: new Date(cookieExpiry),
              httpOnly: true
            })
          },
          body: { verified, id: user.id }
        }
      } else {
        return { status: 400, body: { error: 'verification failed' } }
      }
    } catch (error) {
      console.error(error)
      return { status: 400, body: { error: error.message } }
    }
  }

  return { body: { error: 'type not specified' } }
}
