const { Client, Intents, Collection, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });
const moment = require('moment');
const fs = require("fs");
const cron = require("cron");

//Access config files
require('dotenv').config();
let config = require("./config.json");

//CommandHandler
client.commands = new Collection();
const cmdFiles = fs.readdirSync("./events/").filter(file => file.endsWith('.js'));

if(cmdFiles.length <=0){
  console.log("No commands to load");
  return;
}

console.log(`Loaded ${cmdFiles.length} commands from ./events/`);

for (const file of cmdFiles) {
  let props = require(`./events/${file}`);
  client.commands.set(props.data.name, props);
};



//Variables
const TOKEN = config.token;

//Ready to use
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}\n`);
  console.log("=======Servers=======")
  client.guilds.cache.forEach(guild => {
    console.log(guild.name)
  })
  console.log("=====================\n")

  console.log("[Bot ready to use]")
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'Failed executing the command', ephemeral: true });
	}
});

client.on("messageDelete", (messageDelete) => {

  var member = messageDelete.member.user.tag; //get user who deleted the message

  if (!messageDelete.content.startsWith("/purge")) {
    var msgUsers = config.msgusers;

    const delMsg = new MessageEmbed()
      .setColor("#bdbdbd")
      .setTitle(member)
      .setDescription(messageDelete.content)

    //Loop over 'msgservers' in config file
    if (config.msgservers.includes(messageDelete.guild.id)) {
      for (x of msgUsers) {
        try {
          client.users.cache.get(x).send({ embeds: [delMsg] });
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
});


client.login(TOKEN);
