import { CommandInteraction } from "discord.js";
import { BOT } from "../config";
import { Command } from "../interfaces/command";
import { updateConfig } from "../utils/updateConfig";

export default class extends Command {
    name = 'cleartrains'
    description = 'Removes all trains from the tracker.'
    async run(interaction: CommandInteraction): Promise<void> {
        if (BOT.trains.length === 0) return interaction.reply({ content: `There are no trains to clear.`, ephemeral: true });

        BOT.trains = [];
        updateConfig(BOT);

        return interaction.reply({ content: `The list of trains being tracked has been cleared.`, ephemeral: true });
    }
}