import { exists, readFile, writeFile } from '$lib/data-io/data-io'
import { decode, encodeUrl as encode } from '@borderless/base64'
import { bytesToString } from '$lib/functions/string-encode'

export type UserAccount = {
  id: string, // webauthn rawId base64url encoded
  username: string, // user's username
  authenticator: {
    counter: number,
    credentialPublicKey: Uint8Array,
    credentialID: Uint8Array
  }
}

export type UserAccountJSON = {
  id: string, // webauthn rawId base64url encoded
  username: string, // user's username
  authenticator: {
    counter: number,
    credentialPublicKey: string,
    credentialID: string
  }
}


export async function createUser (registration) {
  const filename = `users/${encode(registration.credentialID)}.json`
  if (await exists(filename)) throw new Error('User is already registered')
  await writeFile(filename, JSON.stringify({
    id: encode(registration.credentialID),
    username: 'unspecified',
    authenticator: {
      counter: registration.counter,
      credentialPublicKey: encode(registration.credentialPublicKey),
      credentialID: encode(registration.credentialID)
    }
  } as UserAccountJSON))
}

// export async function setUserChallenge (rawId: Uint8Array | string, currentChallenge: string) {
//   const idString = typeof rawId === 'string' ? rawId : encode(rawId)
//   const filename = `users/${idString}.json`
//   const userFile: UserAccount = JSON.parse(bytesToString(await readFile(filename)))
//   userFile.currentChallenge = currentChallenge
//   await writeFile(filename, JSON.stringify(userFile))
// }

/** Given a credential ID, lookup user and return their information */
export async function getUser (id: Uint8Array | string): Promise<UserAccount> {
  const idString = typeof id === 'string' ? id : encode(id)
  const filename = `users/${idString}.json`
  const obj = JSON.parse(bytesToString(await readFile(filename)))
  if (obj.authenticator) {
    obj.authenticator.credentialPublicKey = decode(obj.authenticator.credentialPublicKey)
    obj.authenticator.credentialID = decode(obj.authenticator.credentialID)
  }
  return obj
}
