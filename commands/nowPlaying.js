const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const emoji = require('../util/emoji.js');

module.exports = {
	command: new SlashCommandBuilder()
		.setName('nowplaying')
		.setDescription('Display the current playing track'),
	async execute(interaction) {
    const player = await this.client.dtune.getPlayer(interaction.guildId)
		const { queue } = await player.getQueue(0, 1, true)

		if (queue.length < 0) return interaction.reply({ content: emoji("crash") + " There is no music playing.", ephemeral: true })
		const track = queue[0]

		const embed = new MessageEmbed()
		.setTitle(`${emoji("dance")} Now playing:`)
		.setImage(track.thumbnail)
		.setDescription(`[${track.title} - ${track.lengthFormatted}](${track.url})`)
		//.setFooter("Requested by " + track.requester.username, 'https://cdn.discordapp.com/avatars/' + track.requester.id + "/" + track.requester.avatar + ".webp")

		interaction.reply({ embeds: [embed], ephemeral: true });
	}
};
