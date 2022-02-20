const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Adds new iskurepla to the database')
        .addStringOption(option =>
            option.setName("amount")
                .setDescription("Amount of messages to purge")
                .setRequired(true)
        ),
    async execute(interaction) {
        const channel = interaction.channel;
        const amount = interaction.options.getString("amount");
        try {
            await channel.bulkDelete(amount, true);
            return await interaction.reply(`Removed ${amount} messages`);
        } catch (error) {
            console.log(error);
            return await interaction.reply(`Failed to remove messages`)
        }
    },
};
