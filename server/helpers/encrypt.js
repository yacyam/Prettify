const CryptoJS = require('crypto-js')

function encryptToken(token) {
  return CryptoJS.AES.encrypt(token, process.env.ENCRYPTION_SECRET).toString()
}

function decryptToken(encrypted) {
  return (
    CryptoJS.AES.decrypt(encrypted, process.env.ENCRYPTION_SECRET)
      .toString(CryptoJS.enc.Utf8)
  )
}

module.exports = { encryptToken, decryptToken }