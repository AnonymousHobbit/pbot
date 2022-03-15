const { Client, Intents, Collection, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });
const fs = require("fs");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

//Access config files
const config = require("./config.json");

//CommandHandler
client.commands = new Collection();
const commands = []
const commandFiles = fs.readdirSync("./events/").filter(file => file.endsWith('.js'));

if(commandFiles.length <=0){
  console.log("No commands to load");
}

console.log(`Loaded ${commandFiles.length} commands from ./events/`);

for (const file of commandFiles) {
  let props = require(`./events/${file}`);
  commands.push(props.data.toJSON());
  client.commands.set(props.data.name, props);
};

//Ready to use
client.on('ready', () => {

  console.log(`Logged in as ${client.user.tag}\n`);

  const rest = new REST({ version: '9' }).setToken(config.token);

  (async () => {
    try {
      if (process.env.DC_ENV === "production") {
        await rest.put(
          Routes.applicationCommands(config.clientId),
          { body: commands },
        );
        console.log('Successfully registered application commands globally.');
      } else {
        await rest.put(
          Routes.applicationGuildCommands(config.clientId, config.testGuild),
          { body: commands },
        );
        console.log('Successfully registered application commands for test guild.'); 
      }
      
    } catch (error) {
      console.error(error);
    }
  })();
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

  try {
    var member = messageDelete.member.user.tag;
  } catch (err) {
    return
  }

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
          continue;
        }
      }
    }
  }
});


client.login(config.token);
