const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require("axios");
const { apiUrl, apiKey, allowedGuilds } = require('../config.json');
const { DateTime } = require("luxon");
const { MessageEmbed } = require('discord.js');

function day_checker(date) {
    if (date.seconds < 1) {
        return "Event is today!";
    }
    if (date.hours < 1) {
        return `${date.minutes} minutes`;
    }
    if (date.days === 1) {
        return `${date.days} day`;
    }
    if (date.days === 0) {
        return `${date.hours} hours and ${Math.ceil(date.minutes)} minutes`;
    }
    
    return `${date.days} days`;
}

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
                .setDescription("Add a new event to the database")
                .addStringOption(option =>
                    option.setName("name")
                        .setDescription("Name of the event")      
                )
                .addStringOption(option =>
                    option.setName("date")
                        .setDescription("Date of the event. Format: DD.MM.YYYY")
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

            const date_object = DateTime.fromFormat(date, "d.M.yyyy").setZone("Europe/Helsinki");

            if (date_object.invalid !== null) {
                return await interaction.reply("Date must be in format DD.MM.YYYY");
            }

            date = date_object.toFormat("dd.MM.yyyy");
            
            try {
                const response = await axios.post(`${apiUrl}/events`, { author: author, name: name, date: date }, { headers: { authorization: apiKey } });
                if (response.data.error) {
                    return await interaction.reply(response.data.error);
                }

                return await interaction.reply(`Event \`${response.data.name}\` added to the database`);
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
                const response = await axios.get(`${apiUrl}/events?name=${name}`, { headers: { authorization: apiKey } });
                
                if (response.data.error) {
                    return await interaction.reply(response.data.error);
                }

                let event_date = response.data[0].date;
                let event_name = response.data[0].name;

                //calculate days until event
                const until_event = DateTime.fromISO(event_date).diff(DateTime.now(), ["days", "hours", "minutes", "seconds"]).toObject();

                let msg = `TJ of \`${event_name}\` is currently ${day_checker(until_event)}`;
                
                return await interaction.reply(msg);
            } catch (err) {
                return await interaction.reply(`Request to backend failed with ${err}`);
            }
        }

        else if (cmd === "list") {
            try {
                const response = await axios.get(`${apiUrl}/events`, { headers: { authorization: apiKey } });
                if (response.data.error) {
                    return await interaction.reply(response.data.error);
                }

                const eventEmbed = new MessageEmbed()
                    .setTitle("Event list")
                    .setColor("#0099ff")
                    .setTimestamp()
                
                function date_sort(a, b) {
                    return DateTime.fromISO(a.date).toMillis() - DateTime.fromISO(b.date).toMillis();
                }

                //Sort events by date
                response.data.sort(date_sort);

                //Create an embed
                response.data.forEach(event => {
                    let event_object = DateTime.fromISO(event.date).diff(DateTime.now(), ["days", "hours", "minutes", "seconds"]).toObject();
                    let tj = day_checker(event_object);
                    let msg = `TJ: ${tj}`
                    if (event_object.seconds < 1) {
                        msg = day_checker(event_object);
                    }
                    var title = `${event.name} - ${DateTime.fromISO(event.date).toFormat("d.M.yyyy")}`;
                    eventEmbed.addField(title, msg);
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
                const response = await axios.delete(`${apiUrl}/events?name=${name}`, { headers: { authorization: apiKey } });
                if (response.data.error) {
                    return await interaction.reply(response.data.error);
                }

                return await interaction.reply(`Event \`${name}\` deleted`);

            } catch (err) {
                return await interaction.reply(`Request to backend failed with ${err}`);
            }
        }
        else {
            return await interaction.reply("Command not found");
        }
        
    }
}