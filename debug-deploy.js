const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('./config.js');
const Discord = require('discord.js');

const client = new Discord.Client(config.discordjs);

client.on('ready', () => {
  (async () => {
  	await rest.put(
  		Routes.applicationCommands(client.user.id),
  		{ body: commands }
  	);
  })()
});

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.command.toJSON());
}

const rest = new REST({ version: '9' }).setToken(config.tokens.discord);

client.login(config.tokens.discord);
