import { DiscordBotToken, DiscordPublicKey } from './_setup'
import { bytesToString, stringToBytes } from '$lib/functions/string-encode.js'
import { verifyKey } from 'discord-interactions'
//import fetch from 'node-fetch'
import { nanoid } from 'nanoid'

export async function discordRequest(endpoint, options) {
  // append endpoint to root API URL
  const url = `https://discord.com/api/v10/${endpoint}`

  // Stringify payloads
  if (options.body) {
    if (!(options.body instanceof Uint8Array)) {
      options.body = JSON.stringify(options.body)
      options.headers = options.headers || {}
      options.headers['Content-Type'] = 'application/json; charset=UTF-8'
    }
  }

  const request = new Request(url, {
    ...options,
    headers: {
      Authorization: `Bot ${DiscordBotToken}`,
      ...(options.headers || {})
    },
  })

  // console.log('request')
  // console.log(request)

  // Use node-fetch to make requests
  const res = await fetch(request)

  // console.log('response')
  // console.log(res)

  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}

export function isValidReq (req: Request, bodyText: string): boolean {
  const signature = req.headers.get('X-Signature-Ed25519')
  const timestamp = req.headers.get('X-Signature-Timestamp')
  return verifyKey(bodyText, signature, timestamp, DiscordPublicKey)
}

type PayloadFile = {
  fieldname: string, // form field name
  filename: string, // filename for form submission
  data: Uint8Array, // buffer of file data
  type: string, // mime type
}

export function formDataBody (json_payload: object, ...files: PayloadFile[]) {
  const chunks = []
  const boundaryString = `${nanoid()}`
  const boundary = stringToBytes(`--${boundaryString}\r\n`)
  const newline = stringToBytes('\r\n')
  chunks.push(boundary)
  chunks.push(stringToBytes('Content-Disposition: form-data; name="payload_json"\r\n'))
  chunks.push(stringToBytes('Content-Type: application/json\r\n\r\n'))
  chunks.push(stringToBytes(JSON.stringify(json_payload)))
  chunks.push(newline)

  for (const file of files) {
    chunks.push(boundary)
    chunks.push(stringToBytes(`Content-Disposition: form-data; name="${file.fieldname}"; filename="${file.filename}"\r\n`))
    chunks.push(stringToBytes(`Content-Type: ${file.type}\r\n\r\n`))
    chunks.push(file.data)
    chunks.push(newline)
  }

  chunks.push(stringToBytes(`--${boundaryString}--`))

  return {
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundaryString}`
    },
    body: new Uint8Array([...chunks.map(x => [...x])].flat())
  }
}