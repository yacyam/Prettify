const mongoose = require('mongoose')

const SpotifyUser = new mongoose.Schema({
  spotifyId: {
    type: mongoose.SchemaTypes.String,
    required: true
  },
  accessToken: {
    type: mongoose.SchemaTypes.String,
    required: true
  },
  refreshToken: {
    type: mongoose.SchemaTypes.String,
    required: true
  },
  createdAt: {
    type: mongoose.SchemaTypes.Date,
    required: true,
    default: new Date()
  }
})

module.exports = mongoose.model('spotify_users', SpotifyUser)