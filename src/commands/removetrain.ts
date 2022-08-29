import { ApplicationCommandOptionData, CommandInteraction, MessageEmbed } from "discord.js";
import { BOT } from "../config";
import { Command } from "../interfaces/command";
import { updateConfig } from "../utils/updateConfig";

export default class extends Command {
    name = 'removetrain'
    description = 'Removes a train from the tracker if it is being tracked.'
    options: ApplicationCommandOptionData[] = [
        {
            name: 'train',
            description: 'The number of the train to remove.',
            type: 'STRING',
            required: true
        }
    ]
    async run(interaction: CommandInteraction): Promise<void> {
        const train = interaction.options.getString('train');

        if (!BOT.trains.includes(train)) return interaction.reply({ content: `Train no. ${train} is not being tracked!`, ephemeral: true });

        BOT.trains.splice(BOT.trains.indexOf(train), 1);
        updateConfig(BOT);
        
        let embed: MessageEmbed;
        if (BOT.trains.length > 0) {
            embed = new MessageEmbed()
                .setTitle(`Removed train #${train} from the tracker.`)
                .setFooter({ text: 'This update will be visible the next time the information board refreshes.' })
                .setColor('RED')
                .addField(
                    'Currently tracked trains',
                    BOT.trains.join(', '),
                    false
                );
        } else {
            embed = new MessageEmbed()
                .setTitle(`Removed train #${train} from the tracker.`)
                .setFooter({ text: 'The train tracking list is now empty.' })
                .setColor('RED')
        }

        return interaction.reply({ embeds: [embed], ephemeral: true })
    }
}