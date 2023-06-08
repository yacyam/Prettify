const { Router } = require('express')
const router = Router()
const { encryptToken } = require('../helpers/encrypt')
const SpotifyUser = require('../database/schema/SpotifyUser')
const { decryptToken } = require('../helpers/encrypt')
const request = require('request')

router.get('/authenticate', (req, res) => {
  if (req.user) {
    res.send('ok')
  }
  else {
    res.sendStatus(401)
  }
})

router.get('/info', (req, res) => {
  try {
    const accessToken = req.user.accessToken
    const decryptedAccess = decryptToken(accessToken)

    res.send(decryptedAccess)
  }
  catch (err) {
    res.send(err)
  }
})

router.get('/refresh_token', function (req, res) {
  try {
    console.log('refreshing')
    const refreshToken = req.user.refreshToken
    const decryptedRefresh = decryptToken(refreshToken)

    const clientID = process.env.SPOTIFY_CLIENT_ID
    const clientSECRET = process.env.SPOTIFY_CLIENT_SECRET

    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Authorization': 'Basic ' + (new Buffer.from(clientID + ':' + clientSECRET).toString('base64'))
      },
      form: {
        grant_type: 'refresh_token',
        refresh_token: decryptedRefresh
      },
      json: true
    }

    request.post(authOptions, async function (error, response, body) {
      if (!error && response.statusCode === 200) {
        const newAccessToken = body.access_token;
        const encryptedNewAccess = encryptToken(newAccessToken, process.env.ENCRYPTION_SECRET)

        await SpotifyUser.findOneAndUpdate({ spotifyId: req.user.spotifyId }, {
          accessToken: encryptedNewAccess
        })
        res.sendStatus(200)
      }
    })
  }
  catch (err) {
    res.send(err)
  }
})

module.exports = router