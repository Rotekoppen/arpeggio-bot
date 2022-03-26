const { SlashCommandBuilder } = require('@discordjs/builders');
const emoji = require('../util/emoji.js');

module.exports = {
	command: new SlashCommandBuilder()
		.setName('addplaylist')
		.setDescription('Adds a track or playlist to your playlist')
		.addStringOption(option => option
			.setName('query')
			.setRequired(true)
			.setDescription('Title or URL of track to add')
		),
	async execute(interaction) {
		const query = await interaction.options.getString('query');
		interaction.reply({ content: "Working... " + emoji("working"), ephemeral: true });

		let track = await this.client.trackCreator.createTrackWithQuery(query)
    if (track.constructor !== Array) {
      this.client.playlist.addTrack(interaction.user.id, track)
      interaction.editReply({ content: "Added to playlist: " + track.metadata.title, ephemeral: true });
    } else {
      track.forEach((item, i) => {
        this.client.playlist.addTrack(interaction.user.id, item)
      });
      interaction.editReply({ content: "Added playlist to playlist: " + track.length + " tracks added", ephemeral: true });
    }
	}
};
