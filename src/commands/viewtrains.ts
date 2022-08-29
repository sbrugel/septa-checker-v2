import { CommandInteraction, MessageEmbed } from "discord.js";
import { BOT } from "../config";
import { Command } from "../interfaces/command";

export default class extends Command {
    name = 'viewtrains'
    description = 'Returns a list of currently tracked trains.'
    async run(interaction: CommandInteraction): Promise<void> {
        if (BOT.trains.length === 0) return interaction.reply({ content: 'No trains are currently being tracked. You can add trains using the `/addtrain` command.', ephemeral: true });

        const embed = new MessageEmbed()
            .setTitle('Currently tracked trains')
            .setDescription(BOT.trains.join(', '))
            .setColor('BLURPLE')
        
        return interaction.reply({ embeds: [embed], ephemeral: true })
    }
}