const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require("axios");
const { apiUrl } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('iskurepla')
		.setDescription('Displays one random pick-up line'),
	async execute(interaction) {
		const repla = await axios.get(`${apiUrl}/random`);
		await interaction.reply(repla.data[0].repla);
	},
};
