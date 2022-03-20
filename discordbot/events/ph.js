const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');
const PornHub = require('pornhub.js')
const pornhub = new PornHub()

module.exports = {
	data: new SlashCommandBuilder()
		.setName('phub')
		.setDescription('Search a video from Pornhub')
    .addStringOption(option =>
			option.setName("category")
			.setDescription("What category you want to watch?")
			.setRequired(true)
		),
	async execute(interaction) {
    const category = interaction.options.getString("category");
    
    try {
      const video = await pornhub.search('Video', category);
      const randomVid = video.data[Math.floor(Math.random() * video.data.length)];
      
      let embed = new MessageEmbed()
        .setColor("#f58700")
        .setTitle(randomVid.title)
        .setDescription(randomVid.url)

      return await interaction.reply({ embeds: [ embed ]});
    } catch (error) {
      console.log(error);
      return await interaction.reply("No videos found");
    }
	},
};
