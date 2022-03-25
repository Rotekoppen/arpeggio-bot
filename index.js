console.log("Starting bot! - Escape the censored internet!")

const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.js');
const client = new Discord.Client(config.discordjs);

const emoji = require('./util/emoji.js')

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  command.client = client;
  client.commands.set(command.command.name, command);
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}! - Add the bot to your server using:\n'${config.inviteLink.split("@@@").join(client.user.id)}'`)
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);

    const errorMsg = {
      content: emoji("crash") + " There was an error executing the command: " + error,
      ephemeral: true
    }
    if (interaction.replied) {
      await interaction.followUp(errorMsg);
    } else {
      await interaction.reply(errorMsg);
    }
  }
});

client.data = require('./util/data.js');
client.data.promise = client.data.init()

// Different modules of the bot
client.dtune = require('dtune');
client.trackCreator = require('dtune/trackCreator.js');
client.dtuneChecks = require('dtune/userCheck.js');
client.playlist = require('./util/playlists.js')(client, client.data, client.dtune);
client.dtuneAnnouncer = require('./util/announcer.js')(client, client.dtune);
client.once('ready', () => {
  client.dashboard = require('./util/dashboard')(client, client.dtune, client.data);
});

client.login(config.tokens.discord);
