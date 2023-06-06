const passport = require('passport')
const SpotifyStrategy = require('passport-spotify').Strategy
const SpotifyUser = require('../database/schema/SpotifyUser')
const CryptoJS = require('crypto-js')
const { encryptToken } = require('../helpers/encrypt')
require('dotenv').config()

/**
 * Serialize user into the session so that when we deserialize the
 * user, the modified session will have the id so we can find them
 * inside of the database
 */
passport.serializeUser((user, done) => {
  console.log('at serializing user')
  console.log(user.id)
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    console.log('at deserializing user')
    const user = await SpotifyUser.findById(id)
    if (!user) throw new Error(`User Not Found`)
    done(null, user)
  } catch (err) {
    done(err, null)
  }
})

passport.use(new SpotifyStrategy(
  {
    clientID: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/spotify/redirect',
    scope: ['user-top-read']
  }, async (accessToken, refreshToken, expires_in, profile, done) => {
    const encryptedAccess = encryptToken(accessToken)
    const encryptedRefresh = encryptToken(refreshToken)

    try {
      const spotifyUser = await SpotifyUser.findOne({ spotifyId: profile.id })
      if (spotifyUser) {
        console.log(`Found User ${spotifyUser}`)
        await spotifyUser.updateOne({
          accessToken: encryptedAccess,
          refreshToken: encryptedRefresh
        })
        return done(null, spotifyUser)
      }
      else {
        console.log('creating user')

        const newUser = await SpotifyUser.create({
          spotifyId: profile.id,
          accessToken: encryptedAccess,
          refreshToken: encryptedRefresh
        })
        return done(null, newUser)
      }
    } catch (err) {
      done(err, null)
    }
  }
))