module.exports = (client, data, dtune) => {
  async function queueTrack(guildId) {
    return new Promise((resolve, reject) => {

      let player = client.dtune.getPlayer(guildId)
      client.channels.fetch(player.channel)
      .then(async channel => {
        if (!player.playlistTrack) {
          let tries = 10
          let playlistTrack = undefined
          while (tries > 0 && !playlistTrack) {
            let member = channel.members.random()
            if (!member.user.bot) {
              let userdata = await client.data.getUser(member.user.id)
              if (userdata?.playlist) {
                if (userdata.playlist.length >= 5) {
                  playlistTrack = userdata.playlist[Math.floor(Math.random() * userdata.playlist.length)];
                  let track = await client.trackCreator.createTrackWithQuery(playlistTrack.url)
                  player.playlistTrack = track
                  if (dtune.preloading) track.preload()
                  resolve();
                }
              }
            }
            tries--;
          }
        }
      })

    });


  }

  function addTrack(userId, track) {
    data.updateUser(userId, {
      $push: {
        playlist: track.metadata
      }
    })
  }

  function removeTrack(userId, trackId) {
    data.updateUser(userId, {
      $pull: {
        playlist: {
          uid: trackId
        }
      }
    })
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
    addTrack,
    removeTrack,
    queueTrack
  }
}
