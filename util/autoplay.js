const play = require('play-dl');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = (client, data, dtune) => {
  const playlistCache = {}
  const lastfmCache = {}

  async function getRandomUserTrack(id) {
    const date = new Date()
    if (playlistCache[id]?.timestamp.getTime() < date.getTime()) {
      playlistCache[id] = undefined
    }
    if (lastfmCache[id]?.timestamp.getTime() < date.getTime()) {
      lastfmCache[id] = undefined
    }

    let userdata = await client.data.getUser(id)

    const functions = {
      playlist: async () => {
        if (!playlistCache[id]) {
          const playlist = await play.playlist_info(userdata.playlist, { incomplete : true })
          if (playlist?.videoCount > 5) {
            const urls = []
            playlist.videos.forEach((video, i) => {
              urls.push(video.url)
            });
            let date = new Date()
            date.setHours(date.getHours() + 1);
            playlistCache[id] = {videos: urls, timestamp: date}
            return true
          }else {
            return false
          }
        }
        return true

      },
      lastfm: async () => {
        if (!lastfmCache[id]) {

          const url = `https://www.last.fm/player/station/user/${userdata.lastfm}/mix?ajax=1`

          let playlist = undefined

          const response = await fetch(url);
          try {
            playlist = await response.json();

            if (playlist?.playlist?.length > 5) {
              const urls = []
              playlist.playlist.forEach((track, i) => {
                let url = track.name + " " + track.artists[0].name
                urls.push(url)
              });

              let date = new Date()
              date.setHours(date.getHours() + 1);
              lastfmCache[id] = {videos: urls, timestamp: date}
              return true
            }else {
              return false
            }
          } catch (e) {
            console.log(e);
            return false
          }
        }
        return true
      }
    }

    let method = Math.random() > 0.5 ? "lastfm" : "playlist"
    let success = false
    console.log(success, method, userdata);

    if (userdata[method]) {
      success = await functions[method]()
    } else {
      if (method == "lastfm") {
        method = await "playlist"
        success = await functions["playlist"]()
      } else {
        method = await "lastfm"
        success = await functions["lastfm"]()
      }
    }
    console.log(success, method);
    if (success) {
      let playlistTrack = undefined

      if (method == "lastfm") {
        console.log(lastfmCache)
        playlistTrack = lastfmCache[id].videos[Math.floor(Math.random() * lastfmCache[id].videos.length)];
      }
      if (method == "playlist") {
        console.log(playlistCache)
        playlistTrack = playlistCache[id].videos[Math.floor(Math.random() * playlistCache[id].videos.length)];
      }
      if (playlistTrack) {
        let track = await client.trackCreator.createTrackWithQuery(playlistTrack)
        if (dtune.preloading) track.preload()
        console.log(playlistTrack)
        return track
      }
    }
    return
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
          while (tries > 0 && !player.playlistTrack) {
            console.log("Trying to queue track")
            let member = channel.members.random()
            if (!member.user.bot) {

              let track = await getRandomUserTrack(member.id)
              if (track) {
                console.log("Success")
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
    console.log("trackEnded", player.playlistTrack)
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
        if (!player.playlistTrack) {
          queueTrack(player.guildId)
        }
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
