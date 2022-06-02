const mongoose = require('mongoose')

//Connect to mongodb
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

//Schema for replas
const replaSchema = new mongoose.Schema({
  author: String,
  repla: String,
  date: Date
})

//Schema for events
const eventSchema = new mongoose.Schema({
  author: String,
  name: String,
  participants: [String],
  date: Date
})


const Repla = mongoose.model('Repla', replaSchema)
const Event = mongoose.model('Trip', eventSchema)

module.exports = { Repla, Event }
