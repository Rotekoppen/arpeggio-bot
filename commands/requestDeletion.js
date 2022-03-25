const { SlashCommandBuilder } = require('@discordjs/builders');
const emoji = require('../util/emoji.js');

module.exports = {
	command: new SlashCommandBuilder()
		.setName('deleteuserdata')
		.setDescription('Delete the data the bot has stored on you. (WARNING: Cannot be undone)')
		.addStringOption(option => option
			.setName('id')
			.setRequired(true)
			.setDescription('The id of your user. (Enable developer mode in discord, then right-click on your user, then copy id)')
		),
	async execute(interaction) {
		const id = await interaction.options.getString('id');
		if (id == interaction.user.id) {
			await interaction.reply({ content: "Requested deletion... " + emoji("working"), ephemeral: true })
			await this.client.data.deleteUser(interaction.user.id);
			interaction.editReply({ content: "Deleted!", ephemeral: true })
		}else {
			await interaction.reply({ content: "Wrong id entered." + emoji("crash"), ephemeral: true })
		}
	}
};
