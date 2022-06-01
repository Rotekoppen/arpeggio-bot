const play = require('play-dl');

module.exports = (client, data, dtune) => {
  const playlistCache = {}

  async function getRandomUserTrack(id) {
    const date = new Date()
    if (playlistCache[id]?.timestamp.getTime() < date.getTime()) {
      playlistCache[id] = undefined
    }

    if (!playlistCache[id]) {
      let userdata = await client.data.getUser(id)
      if (!userdata.playlist) {
        return
      }
      const playlist = await play.playlist_info(userdata.playlist, { incomplete : true })
      if (playlist?.videoCount > 5) {
        playlistCache[id] = playlist
        let date = new Date()
        date.setHours(date.getHours() + 1);
        playlistCache[id].timestamp = date
      }else {
        return
      }
    }

    playlistTrack = playlistCache[id].videos[Math.floor(Math.random() * playlistCache[id].videos.length)];
    let track = await client.trackCreator.createTrackWithQuery(playlistTrack.url)
    if (dtune.preloading) track.preload()
    return track
  }

  async function queueTrack(guildId) {
    return new Promise((resolve, reject) => {

      let player = client.dtune.getPlayer(guildId)
      if (!player?.channel) {
        resolve();
      }
      client.channels.fetch(player.channel)
      .then(async channel => {

        if (!player.playlistTrack) {
          let tries = 10
          let playlistTrack = undefined
          while (tries > 0 && !playlistTrack) {
            let member = channel.members.random()
            if (!member.user.bot) {

              let track = await getRandomUserTrack(member.id)
              if (track) {
                player.playlistTrack = track
                resolve();
              }
            }
            tries--;
          }
        }
      })

    });
  }

  client.dtune.events.on('trackEnded', async (player, track) => {
    if (player.queue.length <= 1) {
      if (player.autoPlay) {
        if (!player.playlistTrack) await queueTrack(player.guildId);
        player.addTrack(player.playlistTrack)
        player.playlistTrack = undefined
      }
    }
  })

  client.dtune.events.on('playingTrack', async (player, track) => {
    if (player.queue.length < 2) {
      if (player.autoPlay) {
        queueTrack(player.guildId)
      }
    }
  })

  client.dtune.events.on('playerCreated', async (player) => {
    let data = await client.data.getGuild(player.guildId);
    if (data.autoPlay) {
      player.autoPlay = true
    }
  })

  return {
    queueTrack
  }
}
