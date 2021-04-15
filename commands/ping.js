const Discord = require("discord.js")

module.exports.run = async (client, message, args) => {
  return message.channel.send("pong")
}

module.exports.help = {
  name: "ping",
  desc: "Replies with pong",
  usage: "usage: /ping"
}
