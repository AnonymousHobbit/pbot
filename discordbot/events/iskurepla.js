const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require("axios");
const { apiUrl, apiKey, allowedGuilds } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('iskurepla')
		.setDescription('Displays one random pick-up line')
		.addStringOption(option =>
			option.setName("add")
				.setDescription("Add a new repla to the database")
		),
	async execute(interaction) {
		
		const repla_to_add = interaction.options.getString("add");
		if (repla_to_add) {
			if (!allowedGuilds.includes(interaction.guildId)) {
				await interaction.reply("This guild is not allowed to add to the database")
			}
			const author = interaction.member.id;

			try {
				const response = await axios.post(apiUrl, { author: author, repla: repla_to_add }, { headers: { phackauth: apiKey } })
				return await interaction.reply(`New repla added: "${response.data.repla}"`);
			} catch (err) {
				return await interaction.reply(`Request to backend failed with ${err}`)
			}
		}
		
		const repla = await axios.get(`${apiUrl}/random`);
		return await interaction.reply(repla.data[0].repla);
	},
};
