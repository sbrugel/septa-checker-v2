import { ApplicationCommandOptionData, CommandInteraction, MessageEmbed } from "discord.js";
import { BOT } from "../config";
import { Command } from "../interfaces/command";
import { updateConfig } from "../utils/updateConfig";

const LINES = [`Airport`, `Chestnut Hill East`, `Chestnut Hill West`, `Cynwyd`, `Fox Chase`, `Lansdale/Doylestown`, `Media/Wawa`, `Manayunk/Norristown`, `Paoli/Thorndale`,
                `Trenton`, `Warminster`, `West Trenton`, `Wilmington/Newark`];

export default class extends Command {
    name = 'addtrain'
    description = 'Track alerts for a specified line.'
    options: ApplicationCommandOptionData[] = [
        {
            name: 'line',
            description: 'The line to track.',
            type: 'STRING',
            required: true,
            choices: LINES.map((line) => ({
                name: line,
                value: line
            }))
        }
    ]
    async run(interaction: CommandInteraction): Promise<void> {
        const line = interaction.options.getString('line');

        if (BOT.alerts.includes(line)) return interaction.reply({ content: `Alerts on the ${line} line are already being tracked!`, ephemeral: true });

        BOT.alerts.push(line);
        updateConfig(BOT);
        
        const embed = new MessageEmbed()
            .setTitle(`Added the ${line} line to the tracker.`)
            .setFooter({ text: 'This line\'s will appear the next time the information board refreshes.' })
            .setColor('GREEN')
            
        return interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
}