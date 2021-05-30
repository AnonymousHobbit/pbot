const Discord = require("discord.js")
const axios = require("axios")

var config = {
  name: "iskurepla",
  desc: "Displays one random pick-up line",
  usage: "Usage: /iskurepla"
}

module.exports.run = async (client,message, args, config) => {
  try {
    axios.get(`${config.apiUrl}/random`)
    .then(line => {
      return message.channel.send(line.data[0].repla)
    })
  } catch (e) {
    return message.channel.send("There was an error with your request")
  }
}


module.exports.help = {
  name: config.name,
  desc: config.desc,
  usage: config.usage
}
