const Discord = require("discord.js")

var config = {
  name: "showdb",
  desc: "Shows every item in the database",
  usage: "Usage: /showdb",
  admin: true
}

module.exports.run = async (client,message, args, db) => {
  if (message.author.id === process.env.ADMINUSER) {
    try {
      db.all("SELECT * FROM phack_com", function(error, row) {
        if (row !== undefined) {
          for (let i = 0; i < row.length; i++) {
            message.channel.send(row[i].id + " : " + row[i].repla + " : " + row[i].date)
          }
        }
      })
    } catch (e) {
      return message.channel.send("There was an error with your request")
    }

  } else {
    return message.channel.send("Not authenticated..")
  }
}

module.exports.help = {
  name: config.name,
  desc: config.desc,
  usage: config.usage,
  perm: config.admin
}
