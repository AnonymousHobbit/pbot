const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require("axios");
const { apiUrl, apiKey, allowedGuilds } = require('../config.json');
const { DateTime } = require("luxon");
const { MessageEmbed } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('tj')
        .setDescription('Calculate how many days until next event')
        .addSubcommand(subcommand =>
            subcommand
                .setName("get")
                .setDescription("Get an event from the database")
                .addStringOption(option =>
                    option.setName("name")
                        .setDescription("Name of the event")
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription("Add a new trip to the database")
                .addStringOption(option =>
                    option.setName("name")
                        .setDescription("Name of the event")      
                )
                .addStringOption(option =>
                    option.setName("date")
                        .setDescription("Date of the event. Format: DD-MM-YYYY")
                )
        
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName("list")
                .setDescription("List all events in the database")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("delete")
                .setDescription("Delete an event from the database")
                .addStringOption(option =>
                    option.setName("name")
                        .setDescription("Name of the event")
                        )
        ),
    async execute(interaction) {
        const cmd = interaction.options.getSubcommand();
        if (cmd === "add") {
            if (!allowedGuilds.includes(interaction.guildId)) {
                return await interaction.reply("This guild is not allowed to add to the database");
            }
            const name = interaction.options.getString("name");
            let date = interaction.options.getString("date");
            const author = interaction.member.id;

            if (name.length < 1 && name.length > 25) {
                return await interaction.reply("Name must be between 1 and 25 characters");
            }


            const date_object = DateTime.fromFormat(date, "d-M-yyyy");
            if (date_object.invalid !== null) {
                return await interaction.reply("Date must be in format DD-MM-YYYY");
            }

            //return await interaction.reply(`Date is ${date_object.toFormat("dd-MM-yyyy")}`);
            date = date_object.toFormat("dd-MM-yyyy");
            
            try {
                const response = await axios.post(`${apiUrl}/trips`, { author: author, name: name, date: date }, { headers: { authorization: apiKey } });
                if (response.data.error) {
                    return await interaction.reply(response.data.error);
                }

                return await interaction.reply(`New event added: "${response.data.name}"`);
            } catch (err) {
                return await interaction.reply(`Request to backend failed with ${err}`);
            }
        }

        else if (cmd === "get") {
            const name = interaction.options.getString("name");
            
            if (!name) {
                return await interaction.reply("Please specify a name");
            }
            try {
                const response = await axios.get(`${apiUrl}/trips?name=${name}`, { headers: { authorization: apiKey } });
                
                if (response.data.error) {
                    return await interaction.reply(response.data.error);
                }

                let trip_date = response.data[0].date;
                let trip_name = response.data[0].name;

                //calculate days until trip
                const until_trip = DateTime.fromISO(trip_date).diff(DateTime.now(), "days").toObject();
                
                return await interaction.reply(`TJ of "${trip_name}" is currently ${Math.round(until_trip.days+1)} days`);
            } catch (err) {
                return await interaction.reply(`Request to backend failed with ${err}`);
            }
        }

        else if (cmd === "list") {
            try {
                const response = await axios.get(`${apiUrl}/trips`, { headers: { authorization: apiKey } });
                if (response.data.error) {
                    return await interaction.reply(response.data.error);
                }

                const eventEmbed = new MessageEmbed()
                    .setTitle("Event list")
                    .setColor("#0099ff")
                    .setTimestamp()
                     
                response.data.forEach(trip => {
                    let days = Math.round(DateTime.fromISO(trip.date).diff(DateTime.now(), "days").toObject().days+1);
                    eventEmbed.addField(trip.name, "TJ: " + days);
                });

                return await interaction.reply({ embeds: [eventEmbed] });
            } catch (err) {
                return await interaction.reply(`Request to backend failed with ${err}`);
            }
        }
        else if (cmd === "delete") {
            const name = interaction.options.getString("name");
            if (!name) {
                return await interaction.reply("Please specify a name");
            }
            try {
                const response = await axios.delete(`${apiUrl}/trips?name=${name}`, { headers: { authorization: apiKey } });
                if (response.data.error) {
                    return await interaction.reply(response.data.error);
                }

                return await interaction.reply(`Event "${name}" deleted`);

            } catch (err) {
                return await interaction.reply(`Request to backend failed with ${err}`);
            }
        }
        else {
            return await interaction.reply("Command not found");
        }
        
    }
}