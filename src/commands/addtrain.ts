import { ApplicationCommandOptionData, CommandInteraction, MessageEmbed } from "discord.js";
import { BOT } from "../config";
import { Command } from "../interfaces/command";
import { updateConfig } from "../utils/updateConfig";

export default class extends Command {
    name = 'addtrain'
    description = 'Add a train to be tracked.'
    options: ApplicationCommandOptionData[] = [
        {
            name: 'train',
            description: 'The number of the train to track.',
            type: 'STRING',
            required: true
        }
    ]
    async run(interaction: CommandInteraction): Promise<void> {
        const train = interaction.options.getString('train');

        if (BOT.trains.includes(train)) return interaction.reply({ content: `Train no. ${train} is already being tracked!`, ephemeral: true });

        BOT.trains.push(train);
        updateConfig(BOT);
        
        const embed = new MessageEmbed()
            .setTitle(`Added train #${train} to the tracker.`)
            .setFooter({ text: 'Your new train\'s status will appear the next time the information board refreshes.' })
            .setColor('GREEN')
            .addField(
                'Currently tracked trains',
                BOT.trains.join(', '),
                false
            );

        return interaction.reply({ embeds: [embed], ephemeral: true })
    }
}