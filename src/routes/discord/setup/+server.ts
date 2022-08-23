import type { RequestHandler } from './$types'
import { DiscordAppID, TestGuildID } from '../_setup.js'
import { discordRequest } from '../_discord_request.js'
import commands from '../_commands.js'

// Checks for a command
export async function hasCommand(command, isDev) {
  // API endpoint to get and post guild commands
  const endpoint = isDev
    ? `applications/${DiscordAppID}/guilds/${TestGuildID}/commands`
    : `applications/${DiscordAppID}/commands`

  try {
    const res = await discordRequest(endpoint, { method: 'GET' })
    const data = await res.json() as any[]

    if (data) {
      const installedNames = data.map((c) => c['name'])
      // This is just matching on the name, so it's not good for updates
      if (!installedNames.includes(command['name'])) {
        console.log(`Installing "${command['name']}"`)
        return await installCommand(command, endpoint)
      } else {
        console.log(`"${command['name']}" command already installed`)
      }
    }
  } catch (err) {
    console.error(err)
  }
}

// Installs a command
export async function installCommand(command, endpoint) {
  // API endpoint to get and post guild commands
  // const endpoint = `applications/${DiscordAppID}/guilds/${TestGuildID}/commands`
  // const endpoint = `applications/${DiscordAppID}/commands`

  // install command
  try {
    return await discordRequest(endpoint, { method: 'POST', body: command })
  } catch (err) {
    console.error(err)
    return err
  }
}

export const GET: RequestHandler = async ({ url }) => {
  if (url.searchParams.get('key') !== import.meta.env.VITE_AUTOMATION_KEY) return new Response('needs automation key query string param', { status: 400 })
  const isDev = url.searchParams.has('dev')

  const output = []
  for (const command of commands) {
    const result = await hasCommand(command, isDev)
    output.push({ command, result })
  }
  return new Response(JSON.stringify(output), { headers: { 'Content-Type': 'application/json' } })
}