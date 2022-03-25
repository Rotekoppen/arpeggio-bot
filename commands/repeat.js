const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	command: new SlashCommandBuilder()
		.setName('repeat')
		.setDescription('Set the playback repeat mode')
		.addStringOption(option => option
			.setName('mode')
			.setRequired(true)
			.setDescription('Title of track or url to play')
      .addChoice('none', 'none')
			.addChoice('all', 'all')
			.addChoice('single', 'single')
		),
	async execute(interaction) {
		if (!await this.client.dtuneChecks.isInVoice(interaction)) return interaction.reply({ content: "You are not in a voice channel", ephemeral: true });
		if (await this.client.dtuneChecks.isInVoiceWithBot(interaction)) return interaction.reply({ content: "You are not in a voice channel with me", ephemeral: true });

		const mode = await interaction.options.getString('mode');

    const player = await this.client.dtune.getPlayer(interaction.guildId)

    if (player) {
      player.setRepeat(mode)
      interaction.reply({ content: "Set mode to " + mode, ephemeral: true });
    }else {
      interaction.reply({ content: "There is no player active " + mode, ephemeral: true });
    }
	}
};
