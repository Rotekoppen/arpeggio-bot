const { SlashCommandBuilder } = require('@discordjs/builders');
const emoji = require('../util/emoji.js');

module.exports = {
	command: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Request a track to play')
		.addStringOption(option => option
			.setName('query')
			.setRequired(true)
			.setDescription('Title of track or url to play')
		),
	async execute(interaction) {
		if (!await this.client.dtuneChecks.isInVoice(interaction)) return interaction.reply({ content: "You are not in a voice channel", ephemeral: true });
		if (await this.client.dtuneChecks.isInVoiceWithBot(interaction)) return interaction.reply({ content: "You are not in a voice channel with me", ephemeral: true });
		if (!await this.client.dtuneChecks.isVoiceJoinable(interaction)) return interaction.reply({ content: "You are not in a voice channel I can join", ephemeral: true });

		const query = await interaction.options.getString('query');
		interaction.reply({ content: "Working... " + emoji("working"), ephemeral: true });

    const track = await this.client.trackCreator.createTrackWithQuery(query)

    const player = await this.client.dtune.getPlayer(interaction.guildId, true)
		await player.joinNice(interaction.member.voice.channel)

		const info = await player.addTrackNice(track)
		if (info.playlist) {
			interaction.editReply({ content: (info.started ? "Started to play: ":"Added to queue: ") + info.track.length + " song" + (info.track.length > 2 ? "s":""), ephemeral: true });
		}else {
			interaction.editReply({ content: (info.started ? "Started to play: ":"Added to queue: ") + info.track.metadata.title, ephemeral: true });
		}
	}
};
