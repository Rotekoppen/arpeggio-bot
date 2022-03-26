const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  command: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Set a channel to recieve announcements from the player.')
    .addSubcommand(subcommand => subcommand
      .setName('here')
      .setDescription('Send announcements from the music player here')
    )
    .addSubcommand(subcommand => subcommand
      .setName('none')
      .setDescription('Stop sending announcements')
    ),
  async execute(interaction) {
    if (interaction.options.getSubcommand() === 'here') {
      await this.client.data.updateGuild(interaction.guild.id, {
        $set: {
          announcementChannel: interaction.channel.id
        }
      });
      interaction.reply({
        content: "Announcements from the music player will now be sent here.",
        ephemeral: true
      })
    } else {
      await this.client.data.updateGuild(interaction.guild.id, {
        $set: {
          announcementChannel: undefined
        }
      });
      interaction.reply({
        content: "Stopped sending announcements",
        ephemeral: true
      })
    }
  }
};
