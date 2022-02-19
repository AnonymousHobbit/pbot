const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require("axios");
const { apiUrl } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('repladb')
        .setDescription('Information of repla database')
        .addStringOption(option =>
            option.setName("info")
            .setDescription("What info you want to get?")
            .setRequired(true)
        ),
    async execute(interaction) {
        const info = interaction.options.getString("info");

        if (info === "amount") {
            try {
                const response = await axios.get(`${apiUrl}/amount`);
                console.log(response.data)
                await interaction.reply(`There are ${response.data} replas in the database`);
            } catch (err) {
                await interaction.reply(`Request to backend failed with ${err}`)
            }
        } else {
            await interaction.reply("Invalid info");
        }
    },
};
