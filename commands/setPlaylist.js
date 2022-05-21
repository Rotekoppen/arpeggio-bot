const { SlashCommandBuilder } = require('@discordjs/builders');
const emoji = require('../util/emoji.js');
const play = require('play-dl');

module.exports = {
	command: new SlashCommandBuilder()
		.setName('playlist')
		.setDescription('Sets an URL to your playlist. The playlist needs to be unlisted or public and has more than 5 songs.')
		.addStringOption(option => option
			.setName('query')
			.setRequired(true)
			.setDescription('Url to playlist')
		),
	async execute(interaction) {
		const query = await interaction.options.getString('query');
		await interaction.reply({ content: "Working... " + emoji("working"), ephemeral: true });

    if (await play.validate(query) != 'yt_playlist') {
      interaction.editReply({ content: "That is not a Youtube Playlist URL", ephemeral: true });
      return
    }

    const playlist = await play.playlist_info(query, { incomplete : true })

    if (playlist.videoCount <= 5) {
      interaction.editReply({ content: "The playlist is too short", ephemeral: true });
      return
    }

    this.client.data.updateUser(interaction.user.id, {
      $set: {
        playlist: playlist.url
      }
    })

    interaction.editReply({ content: "Set your playlist to " + playlist.title + " with " + playlist.videoCount + " tracks", ephemeral: true });
	}
};
