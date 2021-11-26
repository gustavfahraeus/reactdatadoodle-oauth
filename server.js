const express = require('express');
const request = require('request');
const querystring = require('querystring');

const backend = express();

let callbackURL = 'https://serene-temple-40989.herokuapp.com/callback';
let mySpotifyDataID = '3e4d87f4f2c740988bddc9d37a751536'; 
let mySpotifyDataSecret = process.env.SPOTIFY_CLIENT_SECRET

/* Sending the user to Spotify to get permission to play. */
backend.get('/login', (request, response) => {
  response.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      client_id: mySpotifyDataID,
      response_type: 'code',
      redirect_uri: callbackURL,
      scope: 'user-top-read user-read-recently-played',
    }))
});

/* The user comes back from Spotify */
backend.get('/callback', function(req, res) {
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',

    form: {
      code: req.query.code,
      redirect_uri: callbackURL,
      grant_type: 'authorization_code'
    },

    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        mySpotifyDataID + ':' + mySpotifyDataSecret
      ).toString('base64'))
    },

    json: true
  }

  request.post(authOptions, function(error, response, body) {
    var access_token = body.access_token
    let uri = 'https://reactdatadoodle.netlify.app'
    res.redirect(uri + '?access_token=' + access_token)
  })
})


// CLI Message
let port = (process.env.PORT || 8888)
console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`)
backend.listen(port)