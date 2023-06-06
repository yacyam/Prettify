const { Router } = require('express')
const passport = require('passport')
const SpotifyUser = require('../database/schema/SpotifyUser')
const router = Router()

router.get('/spotify', passport.authenticate('spotify'))

router.get('/spotify/redirect', passport.authenticate('spotify', {
  failureRedirect: '/auth/failure',
  successRedirect: '/auth/success'
}))

router.get('/success', (req, res) => {
  res.redirect('http://localhost:5173/')
})

router.get('/failure', (req, res) => {
  res.send('Failure')
})

router.use('/logout', (req, res) => {
  req.logout((err) => res.send(err))
  req.session.destroy()
  res.redirect('http://localhost:5173/')
})

module.exports = router