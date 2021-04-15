const Discord = require("discord.js")
const moment = require("moment")
const crypto = require("crypto");

var config = {
  name: "addquote",
  desc: "adds a new quote",
  usage: `Usage: /addquote <quote>`
}

function phackUuid(len) {
  const id = crypto.randomBytes(len).toString("hex");
  str = id.split('');
  str[4] = '-';
  str[id.length-5] = '-';

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
  var query = db.prepare("INSERT INTO quote_com VALUES (?,?,?)");
  query.run(phackUuid(7), repla, date)
  query.finalize();

  return message.channel.send("Quote successfully added")
}

module.exports.help = {
  name: config.name,
  desc: config.desc,
  usage: config.usage
}
