const mongoose = require('mongoose')

mongoose
  .connect(`${process.env.MONGO_START}${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}${process.env.MONGO_END}`)
  .then(() => console.log('Connected to DB'))
  .catch((err) => console.log(err))