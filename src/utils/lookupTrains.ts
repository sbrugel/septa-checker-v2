import axios from "axios";
import { Client, MessageEmbed, TextChannel } from "discord.js";
import { BOT } from "../config";
import { convertTime } from "./convertTime";

export function lookupTrains(client: Client) {
    let toPrint = "";
    let index = 0;

    axios.get("http://www3.septa.org/hackathon/TrainView/")
    .then((res) => {
        const data = res.data;
        const filteredData = data.filter((t: { trainno: string; }) => BOT.trains.includes(t.trainno));

        if (filteredData.length === 0) toPrint = "No train updates at this time for the services you have specified";
        if (BOT.trains.length === 0) toPrint = "No trains are currently being tracked. You can add trains using the `/addtrain` command."

        if (toPrint === "") {
            for (const train of filteredData) {
                toPrint += `Train no. **${train.trainno}** going to ${train.dest} is currently running **${train.late > 0 ? `${train.late} minute${train.late !== 1 ? `s` : ``} late` : `on time`}** - formed of ${BOT.verboseConsists ? train.consist : `${train.consist.split(',').length} cars`}. Last seen at ${train.currentstop}.`;
                if (index < (filteredData.length - 1)) toPrint += "\n\n";
                index++;
            }
        }
        
        const guild = client.guilds.cache.get(BOT.GUILD_ID);
	    const channel = guild.channels.cache.get(BOT.SEND_TO) as TextChannel;

        let today = new Date();
        let hr = convertTime(today.getHours()),
            min = convertTime(today.getMinutes()),
            sec = convertTime(today.getSeconds());
        let time = hr + ":" + min + ":" + sec;

        channel.messages.fetch({ limit: 1 }).then(messages => { //get only the last message sent
            const trainEmbed = new MessageEmbed()
                .setColor('BLURPLE')
                .setTitle('SEPTA Information Board')
                .setDescription(toPrint)
                .setFooter({ text: `Last update at ${time}` })
            const lm = messages.first()
            if (lm == null || !lm.author.bot) { //no message at all or last message not by bot
                channel.send({ embeds: [trainEmbed] });
            } else {
                lm.edit({ embeds: [trainEmbed] });
            }
        })
    })
}