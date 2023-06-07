const { Router } = require('express')
const router = Router()
const CryptoJS = require('crypto-js')
const { decryptToken } = require('../helpers/encrypt')

router.get('/authenticate', (req, res) => {
  if (req.user) {
    res.send('ok')
  }
  else {
    res.sendStatus(401)
  }
})

router.get('/info', (req, res, next) => {
  try {
    const accessToken = req.user.accessToken
    const encryptionSecret = process.env.ENCRYPTION_SECRET
    const decryptedAccess = decryptToken(accessToken, encryptionSecret)

    res.send(decryptedAccess)
  }
  catch (err) {
    next(err)
  }
})

module.exports = router