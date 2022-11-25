const { SlashCommandBuilder } = require('@discordjs/builders');
const emoji = require('../util/emoji.js');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = {
	command: new SlashCommandBuilder()
		.setName('lastfm')
		.setDescription('Feed mix from lastFM to be played.')
		.addStringOption(option => option
			.setName('username')
			.setDescription('Your username on LastFM')
		),
	async execute(interaction) {
		const username = await interaction.options.getString('username');
		await interaction.reply({ content: "Working... " + emoji("working"), ephemeral: true });

    if (!username) {
      this.client.data.updateUser(interaction.user.id, {
        $set: {
          lastfm: undefined
        }
      })

      interaction.editReply({ content: "Removed the set playlist", ephemeral: true });
      return
    }

    const url = `https://www.last.fm/player/station/user/${username}/mix?ajax=1`

    const response = await fetch(url);
    try {
      const mix = await response.json();
      this.client.data.updateUser(interaction.user.id, {
        $set: {
          lastfm: username
        }
      })

      interaction.editReply({ content: "Set your LastFM username to " + username, ephemeral: true });
    } catch (e) {
      console.log(e);
      interaction.editReply({ content: "Could not set LastFM username, user might not exist", ephemeral: true });
    }
	}
};
