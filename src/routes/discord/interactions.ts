import { verifyKey, InteractionType, InteractionResponseType, InteractionResponseFlags,
         MessageComponentTypes, ButtonStyleTypes } from 'discord-interactions'
import { search } from '$lib/search/search'

const DiscordPublicKey = import.meta.env.VITE_DISCORD_PUBLIC_KEY as string
const DiscordBotToken = import.meta.env.VITE_DISCORD_BOT_TOKEN as string
const DiscordAppID = import.meta.env.VITE_DISCORD_APPLICATION_ID as string
const TestGuildID = '516053468935618574'

function isValidReq (req: Request, bodyText: string): boolean {
  const signature = req.headers.get('X-Signature-Ed25519')
  const timestamp = req.headers.get('X-Signature-Timestamp')
  return verifyKey(bodyText, signature, timestamp, DiscordPublicKey)
}




export async function post ({ request }: { request: Request}) {
  const bodyText = await request.text()
  if (!isValidReq(request, bodyText)) return { status: 401, body: 'Bad request signature' }

  const { type, id, data } = JSON.parse(bodyText)

  if (type === InteractionType.PING) {
    return { body: { type: InteractionResponseType.PONG } }
  } else if (type === InteractionType.APPLICATION_COMMAND) {
    const { name, options } = data

    if (name === 'auslan') {
      const { value: query } = options.find(x => x.name === 'query')
      const { results, totalResults } = await search(query, 0, 1)
      if (totalResults > 0) {
        const data = results[0]
        const permalink = new URL(`/sign/${encodeURIComponent(data.provider)}/${encodeURIComponent(data.id)}`, request.url)
        const source = data.media[0][0]
        return { body: {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Auslan: ${data.title || data.keywords.join(', ')}`,
            embeds: [
              {
                title: `${data.title || data.keywords.join(', ')}`,
                description: `${data.body}`,
                url: permalink.toString(),
                video: {
                  url: source.src,
                  height: source.maxHeight,
                  width: source.maxWidth,
                }
              }
            ]
          }
        }}
      } else {
        return { body: {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: { content: `Auslan: no result found for “${query}”`}
        }}
      }
    } else if (name === 'random-auslan') {
      return { body: {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { content: 'TODO: implement me' }
      }}
    }
  }

  return { status: 500, body: 'why u do??' }
}