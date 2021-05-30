const Discord = require('discord.js');
const client = new Discord.Client();
const moment = require('moment');
const fs = require("fs")
const cron = require("cron")

//Access config files
require('dotenv').config()
let config = require("./config.json")

//CommandHandler
client.commands = new Discord.Collection()
const cmdFiles = fs.readdirSync("./commands/").filter(file => file.endsWith('.js'))

if(cmdFiles.length <=0){
  console.log("No commands to load");
  return;
}

console.log(`Loaded ${cmdFiles.length} commands from ./commands/`);

cmdFiles.forEach((f, i) => {
  let props = require(`./commands/${f}`);
  client.commands.set(props.help.name, props);
});



//variables
const TOKEN = config.token
const PREFIX = config.prefix

//==================================================
//BOT READY
//==================================================

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}\n`);
  console.log("=======Servers=======")
  client.guilds.cache.forEach(guild => {
    console.log(guild.name)
  })
  console.log("=====================\n")

  console.log("[Bot ready to use]")
});


client.on("messageDelete", (messageDelete) => {

  var member = messageDelete.member.user.tag; //get user who deleted the message
  if (!messageDelete.content.startsWith("/purge")) {
    var msgUsers = config.msgusers;

    const delMsg = new Discord.MessageEmbed()
      .setColor("#bdbdbd")
      .setTitle(member)
      .setDescription(messageDelete.content)

    //Loop over 'msgservers' in config file
    if (config.msgservers.includes(messageDelete.guild.id)) {
      for (x of msgUsers) {
        client.users.cache.get(x).send(delMsg);
      }
    }
  }
});


client.on("message", async message => {
  if(message.author.bot) return;
  if(message.content.indexOf(PREFIX) !== 0) return;

  const args = message.content.slice(PREFIX).trim().split(/ +/g);
  const command = args.shift().toLowerCase().substring(1);

  let cmd = client.commands.get(command)
  if (cmd) cmd.run(client, message, args, config)

});

client.login(TOKEN);
