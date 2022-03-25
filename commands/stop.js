const { SlashCommandBuilder } = require('@discordjs/builders');
const emoji = require('../util/emoji.js');

module.exports = {
	command: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stops the queue, clears it, and leaves. Useful if the bot bugs out.'),
	async execute(interaction) {
    if (!await this.client.dtuneChecks.isInVoice(interaction)) return interaction.reply({ content: "You are not in a voice channel", ephemeral: true });
    if (await this.client.dtuneChecks.isInVoiceWithBot(interaction)) return interaction.reply({ content: "You are not in a voice channel with me", ephemeral: true });

		//if (await check.query(interaction, query)) return;

		const reply = interaction.reply({ content: "Working... " + emoji("working"), ephemeral: true });

    await this.client.dtune.removePlayer(interaction.guildId)
		await reply
		interaction.editReply({ content: "Stopped!  " + emoji("working"), ephemeral: true });
	}
};
