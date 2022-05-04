import { InteractionType, InteractionResponseType, MessageComponentTypes, ButtonStyleTypes } from 'discord-interactions'
import { search } from '$lib/search/search.js'
import { getSearchLibrary } from '$lib/search/search.js'
import { getResultByPath, type SearchDataItem } from '$lib/search/search-index.js'
import { getRandomSigns } from '$lib/search/random.js'
import { isValidReq } from './_discord_request.js'
import { times } from '$lib/functions/iters.js'

const MaxPages = 3

function signToMessage ({ sign, request, prefix = '', components = [] }: { sign: SearchDataItem, request: Request, prefix?: string, components?: any[] }) {
  const permalink = new URL(`/sign/${encodeURIComponent(sign.provider)}/${encodeURIComponent(sign.id)}`, request.url)

  return { body: {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: `${prefix}\n\n${permalink}`,
      components
    }
  }}
}

async function runSearch (query: string, request, page = 0) {
  const { results, totalResults } = await search(query, page, 1)
  if (totalResults > 0) {
    const sign = results[0]
    const prefix = `searched “**${query}**”`
    const components = [
      { type: MessageComponentTypes.ACTION_ROW,
        components: [
          ...times(Math.min(MaxPages, totalResults), i => {
            return {
              type: MessageComponentTypes.BUTTON,
              custom_id: `page:${encodeURIComponent(query)}:${i}`,
              label: `${i+1}`,
              style: page === i ? ButtonStyleTypes.PRIMARY : ButtonStyleTypes.SECONDARY,
              disabled: page === i,
            }
          }),
          { type: MessageComponentTypes.BUTTON,
            custom_id: 'del',
            label: 'Remove',
            style: ButtonStyleTypes.SECONDARY,
          },
        ],
      },
    ]
    return signToMessage({ sign, request, prefix, components })
  } else {
    return { body: {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: { content: `Auslan: no result found for “${query}”`}
    }}
  }
}

export async function post ({ request }: { request: Request}) {
  const bodyText = await request.text()
  if (!isValidReq(request, bodyText)) return { status: 401, body: 'Bad request signature' }

  const { type, id, data, token, member, message } = JSON.parse(bodyText)

  if (type === InteractionType.PING) {
    return { body: { type: InteractionResponseType.PONG } }
  } else if (type === InteractionType.APPLICATION_COMMAND) {
    const { name, options } = data
    if (name === 'auslan') {
      const { value: query } = options.find(x => x.name === 'query')
      return await runSearch(query, request, 0)
    } else if (name === 'random-auslan') {
      const [random] = await getRandomSigns(1)
      const sign = await getResultByPath(await getSearchLibrary(), ...random)
      const userId = member.user.id
      return signToMessage({ sign, request, prefix: `<@${userId}> 🎲 rolled the dice…` })
    }
  } else if (type === InteractionType.MESSAGE_COMPONENT) {
    const { custom_id } = data
    const [command, ...opts] = custom_id.split(':')
    if (command === 'del') {
      return { body: {
        type: InteractionResponseType.UPDATE_MESSAGE,
        data: {
          content: '[ Search Result Removed ]',
          components: []
        }
      }}
    } else if (command === 'page') {
      const [query, page] = opts.map(x => decodeURIComponent(x))
      const res = await runSearch(query, request, parseInt(page))
      res.body.type = InteractionResponseType.UPDATE_MESSAGE
      return res
    }
  }

  return { status: 500, body: 'why u do??' }
}