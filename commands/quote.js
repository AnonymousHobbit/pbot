const Discord = require("discord.js")

var config = {
  name: "quote",
  desc: "Shows one randomized quote",
  usage: "Usage: /quote"
}

module.exports.run = async (client,message, args, db) => {
  try {
    if (args.length > 0) {
      return message.channel.send(config.usage)
    }
    db.all("SELECT * FROM quote_com ORDER BY RANDOM() LIMIT 1;", function(error, row) {
      if (row !== undefined && row.length !== 0) {
        for (a in row) {
          return message.channel.send(row[a].repla)
        }

      } else {
        message.channel.send("Database empty")
      }
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
