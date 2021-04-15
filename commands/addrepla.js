const Discord = require("discord.js")
const moment = require("moment")
const crypto = require("crypto");

var config = {
  name: "addrepla",
  desc: "adds repla to iskurepla",
  usage: "Usage: /addrepla <repla>"
}

function phackUuid(len) {
  const id = crypto.randomBytes(len).toString("hex");
  str = id.split('');
  str[4] = '_';
  str[id.length-5] = '_';

  str = str.join('');
  return str
}

module.exports.run = async (client,message, args, db) => {
  if (args.length <= 0) {
    return message.channel.send(config.usage)
  }

  var repla = args.join(" ");
  if (repla.length < 3) {
    return message.channel.send("Repla must be longer than 3 characters")
  }

  var date = moment().format('MM-DD-YYYY');
  var query = db.prepare("INSERT INTO phack_com VALUES (?,?,?)");
  query.run(phackUuid(7), repla, date)
  query.finalize();
  
  return message.channel.send("Iskurepla successfully added")
}

module.exports.help = {
  name: config.name,
  desc: config.desc,
  usage: config.usage
}
