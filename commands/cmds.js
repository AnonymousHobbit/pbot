const Discord = require("discord.js")
const fs = require("fs")
const cmdFiles = fs.readdirSync("./commands/").filter(file => file.endsWith('.js'))

if(cmdFiles.length <=0){
  console.log("No commands to load!");
  return;
}

var config = {
  name: "cmd",
  desc: "Shows list of commands",
  usage: "Usage: /cmd"
}

module.exports.run = async (client, message, args) => {

  let hMessage = {
    "embed": {
      "color": 7211776,
      "fields": [
      ]
    }
  }

  cmdFiles.forEach((f, i) => {
    let props = require(`./${f}`);
    let permissions = "";

    if (props.help.perm !== true) {
      hMessage.embed.fields.push({
        "name": props.help.name + permissions,
        "value": props.help.usage,
      })
    }
  });

  message.channel.send(hMessage)
}

module.exports.help = {
  name: config.name,
  desc: config.desc,
  usage: config.usage
}
