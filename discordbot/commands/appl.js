const Discord = require("discord.js")
var config = {
  name: "appl",
  desc: "Returns an invite link",
  usage: "Usage: /appl <channel_id> <application>"
}

module.exports.run = async (client, message, args) => {
  var app_id = "755600276941176913"
  if (args.length < 1) {
    return message.channel.send(config.usage)
  }
  if (message.guild.channels.cache.get(args[0]) === undefined) {
    return message.channel.send("Please provide valid channel id")
  }
  var channel_id = args[0]
  if (args.length > 1) {
    const application = args[1]
    if (application === "poker") {
      app_id = "755827207812677713"
    }

    if (application === "fish") {
      app_id = "814288819477020702"
    }

    if (application === "betrayal") {
      app_id = "773336526917861400"
    }
  }

  client.api.channels(channel_id)
  .invites.post({
    data: {
       "max_age": 0,
       "max_uses": 0,
       "target_type": 2,
       "target_application_id": app_id,
       "temporary": false,
    }
  })
  .then((invite) => {
    return message.channel.send(new Discord.MessageEmbed().addField("Use application", `[${invite.target_application.name} on ${invite.channel.name}](<https://discord.gg/${invite.code}>)`))
  })
}

module.exports.help = {
  name: config.name,
  desc: config.desc,
  usage: config.usage
}
