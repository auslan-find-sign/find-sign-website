import { exists, readFile, writeFile, deletePath, listFilenames } from '$lib/data-io/data-io'
import { decode, encodeUrl as encode } from '@borderless/base64'
import { bytesToString } from '$lib/functions/string-encode'

export type UserAccount = {
  id: string, // webauthn rawId base64url encoded
  username: string, // user's username
  powers: string[], // user's entitlements
  created: number, // creation timestamp epochMs
  authenticator: {
    counter: number,
    credentialPublicKey: Uint8Array,
    credentialID: Uint8Array
  }
}

export type UserAccountJSON = {
  id: string, // webauthn rawId base64url encoded
  username: string, // user's username
  powers: string[], // user's entitlements
  authenticator: {
    counter: number,
    credentialPublicKey: string,
    credentialID: string
  }
}

export type UserID = string | Uint8Array


export async function createUser (registration) {
  const userID = encode(registration.credentialID)
  if (await getUser(userID)) throw new Error('User is already registered')
  await setUser(userID, {
    id: encode(registration.credentialID),
    username: 'unspecified',
    powers: [],
    created: Date.now(),
    authenticator: {
      counter: registration.counter,
      credentialPublicKey: registration.credentialPublicKey,
      credentialID: registration.credentialID
    }
  })
}

/** Given a credential ID, lookup user and return their information
 * if user doesn't exist, returns undefined
 */
export async function getUser (id: UserID): Promise<UserAccount> {
  const idString = typeof id === 'string' ? id : encode(id)
  const filename = `users/${idString}.json`
  const fileData = await readFile(filename)
  if (fileData === undefined) return undefined
  const obj = JSON.parse(bytesToString(fileData))
  if (obj.authenticator) {
    obj.authenticator.credentialPublicKey = decode(obj.authenticator.credentialPublicKey)
    obj.authenticator.credentialID = decode(obj.authenticator.credentialID)
  }
  return obj
}

export async function setUser (id: UserID, data: UserAccount) {
  const idString = typeof id === 'string' ? id : encode(id)
  const filename = `users/${idString}.json`
  const obj = JSON.parse(JSON.stringify(data))
  if (obj.authenticator) {
    obj.authenticator.credentialPublicKey = encode(obj.authenticator.credentialPublicKey)
    obj.authenticator.credentialID = encode(obj.authenticator.credentialID)
  }
  await writeFile(filename, JSON.stringify(obj))
}

export async function grantPower (id: UserID, power: string) {
  const user = await getUser(id)
  if (!user.powers.includes(power)) {
    user.powers.push(power)
    await setUser(id, user)
  }
}

export async function removePower (id: UserID, power: string) {
  const user = await getUser(id)
  if (user.powers.includes(power)) {
    user.powers = user.powers.filter(x => x !== power)
    await setUser(id, user)
  }
}

export async function userHasPower (id: UserID, power: string) {
  const user = await getUser(id)
  if (!Array.isArray(user.powers)) return false
  if (user.powers.includes(power)) return true
  if (user.powers.includes('everything')) return true
  return false
}

export async function deleteUser (id: UserID) {
  const idString = typeof id === 'string' ? id : encode(id)
  const filename = `users/${idString}.json`
  await deletePath(filename)
}

export async function listUsers (): Promise<string[]> {
  const filenames = await listFilenames('users')
  return filenames.filter(x => x.endsWith('.json')).map(x => x.split('.')[0])
}
