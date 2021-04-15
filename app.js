const Discord = require('discord.js');
const client = new Discord.Client();
const moment = require('moment');
const fs = require("fs")
const sqlite3 = require('sqlite3').verbose();
const cron = require("cron")
//Access .env file
require('dotenv').config()

//Access database
let db = new sqlite3.Database("./repla_DB", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database');
});


function createDB() {
  db.run("CREATE TABLE IF NOT EXISTS phack_com (id TEXT, repla TEXT, date TEXT)")
}

//CommandHandler
client.commands = new Discord.Collection()
const cmdFiles = fs.readdirSync("./commands/").filter(file => file.endsWith('.js'))

if(cmdFiles.length <=0){
  console.log("No commands to load!");
  return;
}

console.log(`Loaded ${cmdFiles.length} commands from ./commands/`);

cmdFiles.forEach((f, i) => {
  let props = require(`./commands/${f}`);
  client.commands.set(props.help.name, props);
});



//variables
const TOKEN=process.env.TOKEN
const PREFIX=process.env.PREFIX

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

  createDB()

  console.log("[Bot ready to use]")
});

//==================================================
//BOT COMMANDS
//==================================================


//On message delete send to id.
client.on("messageDelete", (messageDelete) => {

  var member = messageDelete.member.user.tag; //get user who deleted the message
  if (!messageDelete.content.startsWith("/purge")) {
    var users = process.env.MSGUSERS.split(' ');
    const delMsg = new Discord.MessageEmbed()
      .setColor("#bdbdbd")
      .setTitle(member)
      .setDescription(messageDelete.content)
    //Loop over ID:s in .env file
    for (x of users) {
      client.users.cache.get(x).send(delMsg);
    }
  }
});


client.on("message", async message => {
  if(message.author.bot) return;
  if(message.content.indexOf(PREFIX) !== 0) return;

  const args = message.content.slice(PREFIX).trim().split(/ +/g);
  const command = args.shift().toLowerCase().substring(1);

  let cmd = client.commands.get(command)
  if (cmd) cmd.run(client, message, args, db)

});

client.login(TOKEN);
