import axios from "axios";
import { ApplicationCommandOptionData, CommandInteraction, MessageEmbed } from "discord.js";
import { BOT } from "../config";
import { Command } from "../interfaces/command";
import { updateConfig } from "../utils/updateConfig";

export default class extends Command {
    name = 'query'
    description = 'Get info for the train specified. Does not add it to the tracker.'
    options: ApplicationCommandOptionData[] = [
        {
            name: 'train',
            description: 'The number of the train to look up.',
            type: 'STRING',
            required: true
        }
    ]
    async run(interaction: CommandInteraction): Promise<void> {
        const request = interaction.options.getString('train');

        axios.get("http://www3.septa.org/hackathon/TrainView/")
        .then((res) => {
            const data = res.data;
            const filteredData = data.filter((t: { trainno: string; }) => t.trainno == request);

            if (filteredData.length === 0) return interaction.reply({ content: `This train could not be found. Either the train is currently not running or the train number you entered is invalid.`, ephemeral: true });
            
            const train = filteredData[0];
            return interaction.reply({ content: `Train no. **${train.trainno}** going to ${train.dest} is currently running **${train.late > 0 ? `${train.late} minutes late` : `on time`}** - formed of ${BOT.verboseConsists ? train.consist : `${train.consist.split(',').length} cars`}. Last seen at ${train.currentstop}.`, ephemeral: true });
        });
    }
}