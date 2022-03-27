const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  command: new SlashCommandBuilder()
    .setName('autoplay')
    .setDescription('When queue is finished, play from peoples playlists instead.')
    .addSubcommand(subcommand => subcommand
      .setName('on')
      .setDescription('When queue is finished, play from peoples playlists instead.')
    )
    .addSubcommand(subcommand => subcommand
      .setName('off')
      .setDescription('Disable queueing more songs when queue is empty.')
    ),
  async execute(interaction) {
    const player = this.client.dtune.getPlayer(interaction.guild.id)
    if (interaction.options.getSubcommand() === 'on') {
      let player = this.client.dtuneInterface.getPlayer(interaction.guild.id)
      if (player) {
        player.autoPlay = true
      }
      await this.client.data.updateGuild(interaction.guild.id, {
        $set: {
          autoPlay: true
        }
      });
      interaction.reply({
        content: "Autoplay is now enabled.",
        ephemeral: true
      })
      if (player.queue.length <= 1) {
        this.playlist.queueTrack(interaction.guild.id)
      }
    } else {
      player.autoPlay = false
      await this.client.data.updateGuild(interaction.guild.id, {
        $set: {
          autoPlay: false
        }
      });
      interaction.reply({
        content: "Autoplay is now disabled.",
        ephemeral: true
      })
    }
  }
};
