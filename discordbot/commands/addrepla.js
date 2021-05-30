const Discord = require("discord.js")
const axios = require("axios")

var config = {
  name: "addrepla",
  desc: "Add iskurepla to database",
  usage: "Usage: /addrepla <repla>"
}

module.exports.run = async (client, message, args, config) => {
  if (!config.allowedGuilds.includes(message.guild.id)) return message.channel.send("This server is not allowed to add to the database")
  if (args.length <= 0) {
    return message.channel.send(config.usage)
  }
  var repla = args.join(" ");
  if (repla.length < 3) {
    return message.channel.send("Repla must be longer than 3 characters")
  }

  axios.post(config.apiUrl, {author: message.author.id, repla: repla}, {headers: {phackauth: config.apiKey}})
  .then(data => {
    return message.channel.send("Iskurepla added to the database")
  })
  .catch(err => {
    return message.channel.send("Error with the request. Check if apiKey is correct!")
  })
}

module.exports.help = {
  name: config.name,
  desc: config.desc,
  usage: config.usage
}
