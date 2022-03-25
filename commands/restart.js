const { SlashCommandBuilder } = require('@discordjs/builders');
const emoji = require('../util/emoji.js');

module.exports = {
	command: new SlashCommandBuilder()
		.setName('restart')
		.setDescription('Restarts the current track'),
	async execute(interaction) {
    if (!await this.client.dtuneChecks.isInVoice(interaction)) return interaction.reply({ content: "You are not in a voice channel", ephemeral: true });
    if (await this.client.dtuneChecks.isInVoiceWithBot(interaction)) return interaction.reply({ content: "You are not in a voice channel with me", ephemeral: true });

		const reply = interaction.reply({ content: "Restarting... " + emoji("working"), ephemeral: true });

    const player = await this.client.dtune.getPlayer(interaction.guildId)

    if (player) {
      await player.startNextTrack(false, false)
      await reply
      interaction.editReply({ content: "Restarted!", ephemeral: true });
    }else {
      interaction.editReply({ content: "Nothing is playing", ephemeral: true });
    }
	}
};
