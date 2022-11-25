const { GatewayIntentBits } = require('discord.js');

module.exports = {
  tokens: {
    discord: 'Discord bot token',
    clientSecret: 'Discord client secret'
  },
  mongodb: {
    url: 'mongodb://mongodb connection url',
    dbName: 'discordbot'
  },
  discordjs: {
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMessages],
    disableMentions: 'everyone'
  },
  inviteLink: 'https://discord.com/oauth2/authorize?client_id=@@@&permissions=0&scope=applications.commands%20bot', // @@@ gets replaced with bot ID automatically
  web: {
    rootUrl: 'https://rootUrl',
    sessionSecret: 'sessionSecret',
    port: 3030,
  },
  emojis: {
    help: [
      // String array where the string is the emoji in raw text
      // '<a:help:899031824687329350>'
    ],
    crash: [],
    working: [],
    dance: []
  },
};
