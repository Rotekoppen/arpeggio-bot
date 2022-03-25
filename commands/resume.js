const { SlashCommandBuilder } = require('@discordjs/builders');
const emoji = require('../util/emoji.js');

module.exports = {
	command: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Resumes the playback'),
	async execute(interaction) {
    if (!await this.client.dtuneChecks.isInVoice(interaction)) return interaction.reply({ content: "You are not in a voice channel", ephemeral: true });
    if (await this.client.dtuneChecks.isInVoiceWithBot(interaction)) return interaction.reply({ content: "You are not in a voice channel with me", ephemeral: true });

		//if (await check.query(interaction, query)) return;

		const reply = interaction.reply({ content: "Resuming... " + emoji("working"), ephemeral: true });

    const player = await this.client.dtune.getPlayer(interaction.guildId)
 	  if (player.queue.length < 1) {
   		return interaction.reply({ content: emoji("crash") + " There is no music playing.", ephemeral: true })
   	}

		await player.unpause()
		await reply
		interaction.editReply({ content: "Resumed!  " + emoji("working"), ephemeral: true });
	}
};
