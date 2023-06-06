const PORT = 3000
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const cors = require('cors')
const MongoStore = require('connect-mongo')
const app = express()
require('dotenv').config()
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))

require('./strategy/spotify')

require('./database')

app.use(express.json())
app.use(express.urlencoded())

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_PORT
  })
}))

app.use(passport.initialize())
app.use(passport.session())

const authRoutes = require('./routes/auth')

app.use('/auth', authRoutes)

app.use('/getuser', (req, res) => {
  if (req.user) {
    res.send('ok')
  }
  else {
    res.sendStatus(401)
  }
})

app.listen(PORT, () => console.log(`Server Running on PORT ${PORT}`))



