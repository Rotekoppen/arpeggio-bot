const emoji = require('./emoji.js');
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require('discord.js');

module.exports = (client) => {
  client.dtune.events.on('playingTrack', async (player, track) => {
    const guild = await client.data.getGuild(player.guildId);
    if (guild.announcementChannel) {
      client.channels.fetch(guild.announcementChannel)
        .then(async channel => {
          let message = await channel.send({
            embeds: [
              new MessageEmbed()
              .setTitle(`${emoji("dance")} Now playing:`)
              .setDescription(`[${track.metadata.title} - ${track.metadata.lengthFormatted}](${track.url})`)
              .setImage(track.metadata.thumbnail)
            ],
            components: [
              new MessageActionRow()
              .addComponents(
                new MessageButton()
                .setCustomId('addtoplaylist-' + track.metadata.uid)
                .setLabel('Add to playlist')
                .setStyle('SECONDARY'),
                new MessageButton()
                .setCustomId('skip-' + track.metadata.uid)
                .setLabel('Skip')
                .setStyle('SECONDARY'),
              )
            ]
          })

          const collector = message.channel.createMessageComponentCollector({
            time: 60000 * 5
          });

          collector.on('collect', async i => {
            if (i.customId === 'addtoplaylist-' + track.metadata.uid) {
              client.playlist.addTrack(i.user.id, track)
              i.reply({
                ephemeral: true,
                content: "Added to your playlist"
              })
            }

            if (i.customId === 'skip-' + track.metadata.uid) {
              if (player.queue[0]?.uid == track.metadata.uid) {
                player.skipCurrentTrack()
                i.reply({
                  ephemeral: true,
                  content: "Skipped!"
                })
              }else {
                i.reply({
                  ephemeral: true,
                  content: "The track isnt playing anymore"
                })
              }

            }
          });

          collector.on('end', collected => message.edit({
            components: []
          }));
        })
    }
  })
}