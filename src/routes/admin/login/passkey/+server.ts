import { readFile, writeFile } from "$lib/data-io/data-io"
import { bytesToString } from "$lib/functions/string-encode"
import createAuthEndpoint from "$lib/passkey/endpoint"
import { redirect, type RequestHandler } from "@sveltejs/kit"

const RelyingPartyName = 'Find Sign'

const authEndpoint = createAuthEndpoint({
  rpName: import.meta.env.VITE_VERSION_LABEL ? `${RelyingPartyName} (${import.meta.env.VITE_VERSION_LABEL})` : RelyingPartyName,
  secretKey: import.meta.env.VITE_PASSKEY_CHALLENGE_SECRET,

  async getUser(username) {
    const fileData = await readFile(`users/${username}.json`)
    if (fileData) {
      const object = JSON.parse(bytesToString(fileData))
      return object
    }
  },

  async createUser(username, data) {
    if ((await readFile(`users/${username}.json`)) !== undefined) {
      throw new Error('Username already in use')
    }
    await writeFile(`users/${username}.json`, JSON.stringify({
      powers: [],
      created: (new Date()).toISOString(),
      ...data
    }))
  },

  async updateUser(username, data) {
    await writeFile(`users/${username}.json`, JSON.stringify(data))
  }
})

export const POST: RequestHandler = authEndpoint.POST
export const getSession = authEndpoint.getSession
export const LoginRedirect = redirect(307, '/admin/login')
