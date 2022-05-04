import { discordRequest } from './_discord_request'

export const DiscordPublicKey = import.meta.env.VITE_DISCORD_PUBLIC_KEY as string
export const DiscordBotToken = import.meta.env.VITE_DISCORD_BOT_TOKEN as string
export const DiscordAppID = import.meta.env.VITE_DISCORD_APPLICATION_ID as string
export const TestGuildID = '971275653561327636'

// Checks for a command
export async function hasCommand(command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${DiscordAppID}/guilds/${TestGuildID}/commands`;

  try {
    const res = await discordRequest(endpoint, { method: 'GET' });
    const data = await res.json();

    if (data) {
      const installedNames = data.map((c) => c['name']);
      // This is just matching on the name, so it's not good for updates
      if (!installedNames.includes(command['name'])) {
        console.log(`Installing "${command['name']}"`);
        await installCommand(command);
      } else {
        console.log(`"${command['name']}" command already installed`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

// Installs a command
export async function installCommand(command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${DiscordAppID}/guilds/${TestGuildID}/commands`;
  // install command
  try {
    await discordRequest(endpoint, { method: 'POST', body: command });
  } catch (err) {
    console.error(err);
  }
}