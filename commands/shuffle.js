const { SlashCommandBuilder } = require('@discordjs/builders');
const emoji = require('../util/emoji.js');

module.exports = {
	command: new SlashCommandBuilder()
		.setName('shuffle')
		.setDescription('Shuffles the queue'),
	async execute(interaction) {
    if (!await this.client.dtuneChecks.isInVoice(interaction)) return interaction.reply({ content: "You are not in a voice channel", ephemeral: true });
    if (await this.client.dtuneChecks.isInVoiceWithBot(interaction)) return interaction.reply({ content: "You are not in a voice channel with me", ephemeral: true });

		const reply = interaction.reply({ content: "Shuffling... " + emoji("working"), ephemeral: true });

    const player = await this.client.dtune.getPlayer(interaction.guildId)

    if (player) {
      await player.shuffleQueue()
      await reply
      interaction.editReply({ content: "Shuffled!  " + emoji("working"), ephemeral: true });
    }else {
      interaction.editReply({ content: "There is no player", ephemeral: true });
    }
	}
};
