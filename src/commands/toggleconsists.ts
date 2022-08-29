import { CommandInteraction } from "discord.js";
import { BOT } from "../config";
import { Command } from "../interfaces/command";
import { updateConfig } from "../utils/updateConfig";

export default class extends Command {
    name = 'toggleconsists'
    description = 'For each train, switch between general consist info and exact car numbers.'
    async run(interaction: CommandInteraction): Promise<void> {
        BOT.verboseConsists = !BOT.verboseConsists;
        updateConfig(BOT);

        return interaction.reply({ content: `Now showing ${BOT.verboseConsists ? `exact car numbers` : `general consist information (number of cars)`} for each train.`, ephemeral: true });
    }
}