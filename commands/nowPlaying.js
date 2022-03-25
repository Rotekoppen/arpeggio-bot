const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const emoji = require('../util/emoji.js');

module.exports = {
	command: new SlashCommandBuilder()
		.setName('nowplaying')
		.setDescription('Display the current playing track'),
	async execute(interaction) {
    const player = await this.client.dtune.getPlayer(interaction.guildId)
		const { queue } = await player.getQueue(0, 1, false)

		if (queue.length < 0) return interaction.reply({ content: emoji("crash") + " There is no music playing.", ephemeral: true })
		const track = queue[0]

    let ms = Math.floor(track.resource.playbackDuration / 1000)
    let mmss = ""

    mmss += Math.floor(ms / 60)
    mmss += ":"
    let ss = ms % 60
    if (ss < 10) {
      ss = "0" + ss
    }
    mmss += ss


		const embed = new MessageEmbed()
		.setTitle(`${emoji("dance")} Now playing:`)
		.setImage(track.metadata.thumbnail)
		.setDescription(`[${track.metadata.title}](${track.metadata.url})`)
    .setFooter({
      text: `${mmss} / ${track.metadata.lengthFormatted}${player.repeatMode != "none" ? " - " + player.repeatMode : ""}`
    })
		//.setFooter("Requested by " + track.requester.username, 'https://cdn.discordapp.com/avatars/' + track.requester.id + "/" + track.requester.avatar + ".webp")

		interaction.reply({ embeds: [embed], ephemeral: true });
	}
};
