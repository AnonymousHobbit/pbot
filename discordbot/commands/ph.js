const Discord = require("discord.js")
const PornHub = require('pornhub.js')
const pornhub = new PornHub()

var config = {
  name: "phub",
  desc: "Searches video on Pornhub",
  usage: "Usage: /phub <category>"
}

module.exports.run = async (client, message, args, db) => {
  var argument = args.join("")
  if (argument.length <= 0) {
    return message.channel.send(config.usage)
  }
  pornhub.search('Video', argument).then(result => {

    var rand = result.data[Math.floor(Math.random() * result.data.length)];
    return message.channel.send({

      "embed": {
        "color": 7211776,
        "title": rand.title,
        "description": rand.url
      }
    })
  }).catch(e => {
    return message.channel.send("No videos found")
  })

}

module.exports.help = {
  name: config.name,
  desc: config.desc,
  usage: config.usage
}
