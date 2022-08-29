import { CommandInteraction } from "discord.js";
import { Command } from "../interfaces/command";
import { lookupTrains } from "../utils/lookupTrains";

export default class extends Command {
    name = 'refresh'
    description = 'Forces a refresh of the SEPTA Information Board.'
    async run(interaction: CommandInteraction): Promise<void> {
        lookupTrains(interaction.client);

        return interaction.reply({ content: `Done! The information board should update momentarily.`, ephemeral: true });
    }
}