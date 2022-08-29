import DiscordJS, { ApplicationCommand, Client, Collection, CommandInteraction, Guild, Intents, MessageEmbed, TextChannel } from 'discord.js';
import { readdirRecursive } from './utils/readdirRecursive';
import { Command } from './interfaces/command';
import { BOT } from './config';
import axios from 'axios';
import cron from 'cron';
import { lookupTrains } from './utils/lookupTrains';

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ]
});

client.login(BOT.TOKEN);

client.on('ready', async () => {
    // load actions (commands, context menu options...)
    console.log("Loading actions...");
    client.commands = new Collection();
    const { commands } = client.guilds.cache.get('679777315814637683') as Guild;
    const commandFiles = readdirRecursive(`${__dirname}/commands`).filter(file => file.endsWith('.js'));
    const awaitedCommands: Promise<ApplicationCommand>[] = [];

    for (const file of commandFiles) {
        const commandModule = await import(file);

        const dirs = file.split('/');
		const name = dirs[dirs.length - 1].split('.')[0];

        if (!(typeof commandModule.default === 'function')) {
			console.log(`Invalid command ${name}`);
			continue;
		}

        const command: Command = new commandModule.default;

        command.name = name;

        const guildCmd = commands.cache.find(cmd => cmd.name === command.name);

        const cmdData = {
            name: command.name,
            description: command.description,
            options: command?.options || [],
            defaultPermission: true // allow commands to be used by anyone
        }

        if (!guildCmd) {
            awaitedCommands.push(commands.create(cmdData));
        } else {
            awaitedCommands.push(commands.edit(guildCmd.id, cmdData));
        }
        
        client.commands.set(name, command);
    }

    // done with everything now!
    console.log('Ready!');

    main();
    const job = new cron.CronJob('*/2 * * * *', main); //update at every even minute of the hour - approximately every 2 minutes
	job.start();
});

client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) runCommand(interaction, client);
})

async function runCommand(interaction: CommandInteraction, client: Client): Promise<unknown> {
    const command = client.commands.get(interaction.commandName);

    if (command.run !== undefined) {
        try {
            command.run(interaction);
        } catch (error) {
            return interaction.reply('Sorry, an error occured. ' + error);
        }
    }

    return;
}

function main() {
    lookupTrains(client);
}