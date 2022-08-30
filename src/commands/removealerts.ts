import { ApplicationCommandOptionData, CommandInteraction, MessageEmbed } from "discord.js";
import { BOT } from "../config";
import { Command } from "../interfaces/command";
import { updateConfig } from "../utils/updateConfig";

const LINES = [`Airport`, `Chestnut Hill East`, `Chestnut Hill West`, `Cynwyd`, `Fox Chase`, `Lansdale/Doylestown`, `Media/Wawa`, `Manayunk/Norristown`, `Paoli/Thorndale`,
                `Trenton`, `Warminster`, `West Trenton`, `Wilmington/Newark`];

export default class extends Command {
    name = 'removealerts'
    description = 'Stop tracking alerts for a specified line.'
    options: ApplicationCommandOptionData[] = [
        {
            name: 'line',
            description: 'The line to stop tracking.',
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

        if (!BOT.alerts.includes(line)) return interaction.reply({ content: `Alerts on the ${line} line are not being tracked!`, ephemeral: true });

        BOT.alerts.splice(BOT.alerts.indexOf(line), 1);
        updateConfig(BOT);
        
        const embed = new MessageEmbed()
            .setTitle(`Removed the ${line} line from the tracker.`)
            .setFooter({ text: 'This line\'s will no longer appear unless you re-add it.' })
            .setColor('RED')
            
        return interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
}