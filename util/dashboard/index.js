const express = require('express')
const session = require('express-session')
const passport = require('passport')
const Strategy = require('passport-discord').Strategy
const play = require('play-dl')
const app = express();
const config = require('../../config.js');

module.exports = async function(client, dtune, data) {
  await data.promise

  function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
  }

  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  let scopes = ['identify']
  let prompt = 'consent'

  passport.use(new Strategy({
    clientID: client.user.id,
    clientSecret: config.tokens.clientSecret,
    callbackURL: config.web.rootUrl + "/callback",
    scope: scopes,
    prompt: prompt
  }, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      return done(null, profile);
    });
  }));

  app.use(session({
    secret: config.web.sessionSecret,
    resave: false,
    saveUninitialized: false
  }));

  app.use(passport.initialize());
  app.use(passport.session());


  app.use('/public', express.static(__dirname + '/public'));
  app.use('/vue', express.static(__dirname + '/../../node_modules/vue/dist/vue.global.js'));

  app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/homepage.html');
  });

  app.get('/thanks', function(req, res) {
    res.sendFile(__dirname + '/public/thanks.html');
  });

  app.get('/login',
    passport.authenticate('discord', {
      scope: scopes,
      prompt: prompt
    }),
    function(req, res) {}
  );

  app.get('/callback',
    passport.authenticate('discord', {
      failureRedirect: '/'
    }),
    function(req, res) {
      res.redirect('/dashboard')
    } // auth success
  );

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.get('/dashboard', checkAuth, function(req, res) {
    res.sendFile(__dirname + '/public/dashboard.html');
  });

  app.get('/discord', checkAuth, function(req, res) {
    res.json(req.user);
  });

  app.get('/playlist', checkAuth, async function(req, res) {
    res.json((await client.data.getUser(req.user.id)).playlist);
  });

  app.get('/search/:search', checkAuth, async function(req, res) {
    let query = atob(req.params.search.split("-").join("/"))
    let results = await play.search(query, { source: { youtube: "video" }, limit: 10 })

    res.json(results);
  });

  app.get('/playlist/remove/:trackId', checkAuth, async function (req, res) {
    await client.playlist.removeTrack(req.user.id, req.params.trackId);
    res.send("deleted")
  })

  app.get('/playlist/add/:trackUrl', checkAuth, async function (req, res) {
    let url = atob(req.params.trackUrl.split("-").join("/"))
    let track = await client.trackCreator.createTrackWithQuery(url)
    await client.playlist.addTrack(req.user.id, track);
    res.send("added")
  })

  app.listen(config.web.port, function(err) {
    if (err) return console.log(err)
    console.log('Listening at port ' + config.web.port)
  })
}
