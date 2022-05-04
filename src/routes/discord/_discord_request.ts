import { DiscordBotToken } from './_setup'

export async function discordRequest(endpoint, options) {
  // append endpoint to root API URL
  const url = 'https://discord.com/api/v9/' + endpoint;
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
  // Use node-fetch to make requests
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${DiscordBotToken}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    ...options
  });
  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}