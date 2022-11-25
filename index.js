console.log("Starting bot!")

const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.js');
const client = new Discord.Client(config.discordjs);
client.config = config

const emoji = require('./util/emoji.js')

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  command.client = client;
  client.commands.set(command.command.name, command);
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
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
      content: emoji("crash") + " There was an error executing the command. Please send the error and what you did to the bot owner: " + error,
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
client.dtune = require('dtune'); // Dev package please remember to put back before push
client.trackCreator = require('dtune/trackCreator.js'); // Dev package
client.dtuneChecks = require('dtune/userCheck.js'); // Dev package
client.autoplay = require('./util/autoplay.js')(client, client.data, client.dtune); // Disabled until bot is usable again
client.dtuneAnnouncer = require('./util/announcer.js')(client, client.dtune);
client.cli = require('./util/cli.js')(client);
client.once('ready', () => {
  client.cli.startCLI();
  //client.dashboard = require('./Stache/dashboard')(client, client.dtune, client.data); // Disabled until bot is usable again
  console.log("Type help for available commands")
});

client.login(config.tokens.discord);
