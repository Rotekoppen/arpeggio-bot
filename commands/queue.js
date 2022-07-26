const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const emoji = require('../util/emoji.js');

module.exports = {
	command: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Displays the queued tracks'),
	async execute(interaction) {
    const player = await this.client.dtune.getPlayer(interaction.guildId)
		const {stop, length, queue} = await player.getQueue(0, 20)

		if (length < 1) return interaction.reply({ content: emoji("crash") + " There is no music playing.", ephemeral: true })

		let message = ""
		queue.forEach((song, i) => {
			message += (i == 0) ? '`[Playing]`: ' : '`[' + (i < 10 ? " ":"") + i + ']`: '
			message += `[${song.title} - ${song.lengthFormatted}](${song.url})\n`
		});

		const embed = new MessageEmbed()
		.setTitle(`${emoji("dance")} Queue: ` + player.autoPlay ? "( Autoplay enabled )" : "")
		.setDescription(message)

		if (length > stop) {
			embed.setFooter({text: "+ " + (length - stop) + " more"})
		}

		interaction.reply({ embeds: [embed], ephemeral: true });
	}
};
