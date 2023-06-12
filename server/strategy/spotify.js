const passport = require('passport')
const SpotifyStrategy = require('passport-spotify').Strategy
const SpotifyUser = require('../database/schema/SpotifyUser')
const { encryptToken } = require('../helpers/encrypt')

passport.serializeUser((user, done) => {
  console.log('at serializing user')
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    console.log('at deserializing user')
    const user = await SpotifyUser.findById(id)
    if (!user) {
      throw new Error(`User Not Found`)
    }
    done(null, user)
  } catch (err) {
    done(err, null)
  }
})

passport.use(new SpotifyStrategy(
  {
    clientID: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    callbackURL: 'https://prettify-backend.onrender.com/auth/spotify/redirect',
    scope: ['user-top-read']
  }, async (accessToken, refreshToken, expires_in, profile, done) => {
    const encryptedAccess = encryptToken(accessToken)
    const encryptedRefresh = encryptToken(refreshToken)
    try {
      const spotifyUser = await SpotifyUser.findOne({ spotifyId: profile.id })
      if (spotifyUser) {
        await SpotifyUser.findOneAndUpdate({ spotifyId: profile.id }, {
          accessToken: encryptedAccess,
          refreshToken: encryptedRefresh
        })

        const updatedUser = await SpotifyUser.findOne({ spotifyId: profile.id })
        done(null, updatedUser)
      }
      else {
        console.log('creating user')

        const newUser = await SpotifyUser.create({
          spotifyId: profile.id,
          accessToken: encryptedAccess,
          refreshToken: encryptedRefresh
        })

        done(null, newUser)
      }
    } catch (err) {
      console.log('Error in updating user')
      done(err, null)
    }

  }
))