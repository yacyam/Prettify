const { Router } = require('express')
const passport = require('passport')
const router = Router()

router.get('/spotify', passport.authenticate('spotify'))

router.get('/spotify/redirect', passport.authenticate('spotify', {
  failureRedirect: '/auth/failure',
  successRedirect: '/auth/success'
}))

router.get('/success', (req, res) => {
  res.redirect('https://prettify-spotidata.netlify.app/')
})

router.get('/failure', (req, res) => {
  res.send('Failure')
})

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err)
    res.redirect('https://prettify-spotidata.netlify.app/')
  })
})

module.exports = router