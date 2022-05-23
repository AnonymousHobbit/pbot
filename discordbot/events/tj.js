const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require("axios");
const { apiUrl, apiKey, allowedGuilds } = require('../config.json');
const { DateTime } = require("luxon");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('tj')
        .setDescription('Calculate how many days until next trip')
        .addSubcommand(subcommand =>
            subcommand
                .setName("get")
                .setDescription("Get a trip from the database")
                .addStringOption(option =>
                    option.setName("name")
                        .setDescription("Name of the trip")
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("add")
                .setDescription("Add a new trip to the database")
                .addStringOption(option =>
                    option.setName("name")
                        .setDescription("Name of the trip")      
                )
                .addStringOption(option =>
                    option.setName("date")
                        .setDescription("Date of the trip. Format: DD-MM-YYYY")
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

                return await interaction.reply(`New trip added: "${response.data.name}"`);
            } catch (err) {
                return await interaction.reply(`Request to backend failed with ${err}`);
            }
        }

        if (cmd === "get") {
            const name = interaction.options.getString("name");
            try {
                const response = await axios.get(`${apiUrl}/trips?name=${name}`, { headers: { authorization: apiKey } });
                console.log(response.data)
                let trip_date = response.data[0].date;
                let trip_name = response.data[0].name;

                //calculate days until trip
                const until_trip = DateTime.fromISO(trip_date).diff(DateTime.now(), "days").toObject();
                console.log(until_trip)
                return await interaction.reply(`TJ of "${trip_name}" is currently ${Math.round(until_trip.days+1)}`);
            } catch (err) {
                return await interaction.reply(`Request to backend failed with ${err}`);
            }
        }
        
    }
}