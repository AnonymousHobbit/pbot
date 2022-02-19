const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require("axios");
const { apiUrl, apiKey, allowedGuilds } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addrepla')
		.setDescription('Adds new iskurepla to the database')
		.addStringOption(option =>
			option.setName("iskurepla")
			.setDescription("Repla to add to the datbase")
			.setRequired(true)
		),
	async execute(interaction) {
		if (!allowedGuilds.includes(interaction.guildId)) {
			await interaction.reply("This guild is not allowed to add to the database")
		}
		
		const author = interaction.member.id;
		const repla = interaction.options.getString("iskurepla");

		try {
			const response = await axios.post(apiUrl, {author: author, repla: repla}, {headers: {phackauth: apiKey}})
			await interaction.reply(`New repla added: "${response.data.repla}"`);
		} catch (err) {
			await interaction.reply(`Request to backend failed with ${err}`)
		}
	},
};
