const { SlashCommandBuilder } = require('@discordjs/builders');
const emoji = require('../util/emoji.js');

module.exports = {
	command: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Join a new voice channel'),
	async execute(interaction) {
		if (!await this.client.dtuneChecks.isInVoice(interaction)) return interaction.reply({ content: "You are not in a voice channel", ephemeral: true });
		if (!await this.client.dtuneChecks.isVoiceJoinable(interaction)) return interaction.reply({ content: "You are not in a voice channel I can join", ephemeral: true });

		interaction.reply({ content: "Working... " + emoji("working"), ephemeral: true });

    const player = await this.client.dtune.getPlayer(interaction.guildId, true)
		await player.joinNice(interaction.member.voice.channel, true)
	}
};
