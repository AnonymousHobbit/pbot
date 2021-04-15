const Discord = require("discord.js")

var config = {
  name: "purge",
  desc: "Purges desired amount of messages",
  usage: "Usage: /purge <amount>"
}

module.exports.run = async (client, message, args) => {
  message.delete()
  if (args.length <= 0) {
    client.users.cache.get(message.member.user.id).send(config.usage)
  }
  var amount = parseInt(args[0], 10);
  var amount = amount+1;
  message.channel.bulkDelete(amount).then(() => {
    client.users.get(message.member.user.id).send(`Successfully purged ${amount} messages in server ${message.guild.name}`);
  }).catch(e => {client.users.get(message.member.user.id).send(`Error happened while trying to purge ${amount} messages`)});
}

module.exports.help = {
  name: config.name,
  desc: config.desc,
  usage: config.usage
}
