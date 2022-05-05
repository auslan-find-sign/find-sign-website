import { InteractionType, InteractionResponseType, MessageComponentTypes, ButtonStyleTypes } from 'discord-interactions'
import { search } from '$lib/search/search.js'
import { getSearchLibrary } from '$lib/search/search.js'
import { getResultByPath, type SearchDataItem } from '$lib/search/search-index.js'
import { getRandomSigns } from '$lib/search/random.js'
import { discordRequest, formDataBody, isValidReq } from './_discord_request.js'
import { times } from '$lib/functions/iters.js'
import { lagSwitch } from '$lib/functions/delay.js'
import { DiscordAppID } from './_setup.js'
import { sha256, arrayToHex } from '$lib/search/hash.js'

const MaxPages = 3

async function signToMessage ({ sign, request, message = '', components = [], bodyOverride = {} }: { sign: SearchDataItem, request: Request, message?: string, components?: any[], bodyOverride?: any }) {
  // const permalink = new URL(`/sign/${encodeURIComponent(sign.provider)}/${encodeURIComponent(sign.id)}`, request.url)
  const sources = sign.media[0]
  const source = sources.find(x => x.type.startsWith('video/mp4'))
  const videoTypeLabel = source.type.split('/')[1]
  // const videoResponse = await fetch(source.src)

  // const attachment = {
  //   fieldname: 'files[0]',
  //   filename: `${arrayToHex(await sha256(source.src))}.${source.type.split('/')[1]}`,
  //   data: new Uint8Array(await videoResponse.arrayBuffer()),
  //   type: videoResponse.headers.get('Content-Type')
  // }

  return {
    content: [
      message,
      `Auslan: “**${sign.title || sign.words.join('**”, “**')}**”`,
      `Link: <${sign.link}>`,
      // sign.body,
      source.src
    ].join('\n'),
    components,
    // attachments: [{
    //   id: 0,
    //   filename: attachment.filename,
    //   description: sign.title || sign.words.join(', ')
    // }],
  }//, attachment
}

function placeholderMessage () {
  return { body: {
    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
  }}
}

async function runSearch (query: string, request, page = 0, bodyOverride?: any) {
  const { results, totalResults } = await search(`${query} -#lexis.fingerspell`, page, 1)
  if (totalResults > 0) {
    const sign = results[0]
    const message = `searched “**${query}**”\n`
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
    return await signToMessage({ sign, request, message, components, bodyOverride })
  } else {
    return { body: {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: { content: `Auslan: no result found for “${query}”`},
      ...(bodyOverride || {})
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

      // return await runSearch(query, request, 0)
      // return await lagSwitch(50,
      //   runSearch(query, request, 0),
      //   ,
      //   async (message) => {
      //     const { body } = message
      //     // PATCH `/webhooks/${DiscordAppID}/${token}/messages/@original`
      //     discordRequest(`webhooks/${DiscordAppID}/${token}/messages/@original`, { method: 'PATCH', body })
      //   }
      // )
      runSearch(query, request, 0).then(async result => {
        // PATCH `/webhooks/${DiscordAppID}/${token}/messages/@original`
        discordRequest(`webhooks/${DiscordAppID}/${token}/messages/@original`, {
          method: 'PATCH',
          body: result
        })
      })

      return placeholderMessage()
    } else if (name === 'random-auslan') {
      const [random] = await getRandomSigns(1)
      const sign = await getResultByPath(await getSearchLibrary(), ...random)
      const userId = member.user.id
      signToMessage({ sign, request, message: `<@${userId}> 🎲 rolled the dice…`}).then(message => {
        discordRequest(`webhooks/${DiscordAppID}/${token}/messages/@original`, { method: 'PATCH', body: message })
      })
      return placeholderMessage()
    }
  } else if (type === InteractionType.MESSAGE_COMPONENT) {
    const { custom_id } = data
    const [command, ...opts] = custom_id.split(':')
    if (command === 'del') {
      return {
        body: {
          type: InteractionResponseType.UPDATE_MESSAGE,
          data: {
            content: '[ Search Result Removed ]',
            components: [],
            attachments: [],
          }
        }
      }
    } else if (command === 'page') {
      const [query, page] = opts.map(x => decodeURIComponent(x))
      runSearch(query, request, parseInt(page)).then(result =>
        // discordRequest(`webhooks/${DiscordAppID}/${token}/messages/@original`, { method: 'PATCH', body: {
        //   type: InteractionResponseType.UPDATE_MESSAGE,
        //   data: result
        // }})

        // PATCH `/webhooks/${DiscordAppID}/${token}/messages/@original`
        discordRequest(`webhooks/${DiscordAppID}/${token}/messages/@original`, {
          method: 'PATCH',
          body: result
        })
      )

      return { body: {
        type: InteractionResponseType.DEFERRED_UPDATE_MESSAGE
      }}
    }
  }

  return { status: 500, body: 'why u do??' }
}