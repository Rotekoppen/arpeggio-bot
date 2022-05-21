async function get(url) {
  console.log(url);
  let promise = new Promise(function(myResolve, myReject) {
    let req = new XMLHttpRequest();
    req.open('GET', url);
    req.onload = function() {
      if (req.status == 200) {
        myResolve(req.response);
      } else {
        myReject("File not Found");
      }
    };
    req.send();
  });
  return promise
}

async function getJson(url) {
  return JSON.parse(await get(url))
}

const Dashboard = {
  data() {
    return {
      tab: "search",
      searchQuery: "",
      searchResults: {items:[]},
      playlist: []
    }
  },
  mounted() {
    this.playlistUpdate()
  },
  methods: {
    setTab(tab) {
      if (tab == "playlist") this.playlistUpdate()
      if (tab == "search") {
        this.searchResults = {items:[]}
        this.searchQuery = ""
      }
      this.tab = tab
    },
    setSearch(query) {
      getJson("/search/" + btoa(query).split("/").join("-")).then((results) => this.searchResults.items = results)
    },
    playlistUpdate() {
      getJson("/playlist").then((playlist) => this.playlist = playlist)
    },
    playlistRemoveTrack(track) {
      get("/playlist/remove/" + track.uid).then(this.playlistUpdate)
    },
    playlistAddTrack(track) {
      get("/playlist/add/" + btoa(track.url).split("/").join("-")).then(this.playlistUpdate)
      this.setTab("playlist")
    }
  }
}

Vue.createApp(Dashboard).mount('#app')
