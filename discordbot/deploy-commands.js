const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, testGuild, token } = require('./config.json');

const rest = new REST({ version: '9' }).setToken(token);

const commands = [];
const commandFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./events/${file}`);
	commands.push(command.data.toJSON());
}

(async () => {
	try {
		await rest.put(
			Routes.applicationCommands(clientId),
			//Routes.applicationGuildCommands(clientId, testGuild),
			{ body: commands },
		);

		console.log('Successfully registered application commands.');
	} catch (error) {
		console.error(error);
	}
})();
