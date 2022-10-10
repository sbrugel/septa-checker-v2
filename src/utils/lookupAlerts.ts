import axios from "axios";
import { Client, MessageEmbed, TextChannel } from "discord.js";
import { BOT } from "../config";
import { convertTime } from './convertTime';

function sanitizeHTML(str: string) {
    // remove class properties to make sanitizing easier
    str = str.replace(/ (class|href)=(.+?)(?=>)/g, '');
    
    // further preparations
    str = str.replace('<a >', '<a>');

    // replace tags or asterisks with markdown or nothing
    str = str.replace(/<p>|<a>|<\/a>|<ul>|<\/ul>|<li>|<br \/>|\*+/g, '');
    str = str.replace(/<\/li>/g, ', ');
    str = str.replace(/<\/p>/g, '\n\n');
    str = str.replace(/<strong>|<\/strong>/g, '**');
    str = str.replace(/<em>|<\/em>/g, '*');
    str = str.replace(/<h3>/g, '__**');
    str = str.replace(/<\/h3>/g, '**__\n');
    return str;
}

export function lookupAlerts(client: Client) {
    let toPrintAlerts = "";
    let toPrintAdvisories = "";

    axios.get("http://www3.septa.org/hackathon/Alerts/")
    .then((res) => {
        if (BOT.alerts.length === 0) {
            toPrintAlerts = "You are not tracking any lines for alerts.";
            toPrintAdvisories = "You are not tracking any lines for alerts.";
        }
        const filteredData = res.data.filter((alert) => BOT.alerts.includes(alert.route_name));
        for (const alert of filteredData) {
            if (!alert.alert) toPrintAlerts += `*There are no alerts on the ${alert.route_name} line.*\n\n`;
            else {
                toPrintAlerts += `***There are alerts on the ${alert.route_name} line.***\n`
                toPrintAlerts += sanitizeHTML(alert.alert) + `\n\n`;
            }

            if (!alert.advisory) toPrintAdvisories += `*There are no advisories on the ${alert.route_name} line.*\n\n`;
            else {
                toPrintAdvisories += `***There are advisories on the ${alert.route_name} line.***\n`
                toPrintAdvisories += sanitizeHTML(alert.advisory);
            }
        }

        const guild = client.guilds.cache.get(BOT.GUILD_ID);
	    const channel = guild.channels.cache.get(BOT.SEND_ALERTS_TO) as TextChannel;

        if (toPrintAlerts.length > 4096) {
            toPrintAlerts = toPrintAlerts.substring(0, 3900);
            toPrintAlerts += "...\n\n**__Cannot display all alerts. View all at https://realtime.septa.org/system/rail__**";
        }
        if (toPrintAdvisories.length > 4096) {
            toPrintAdvisories = toPrintAdvisories.substring(0, 3900);
            toPrintAdvisories += "...\n\n**__Cannot display all alerts. View all at https://realtime.septa.org/system/rail__**";
        }

        let today = new Date();
        let hr = convertTime(today.getHours()),
            min = convertTime(today.getMinutes()),
            sec = convertTime(today.getSeconds());
        let time = hr + ":" + min + ":" + sec;

        channel.messages.fetch({ limit: 1 }).then(messages => { //get only the last message sent
            const alertEmbed = new MessageEmbed()
                .setColor('RED')
                .setTitle('SEPTA Alerts Board')
                .setDescription(toPrintAlerts)
            const advisoryEmbed = new MessageEmbed()
                .setColor('YELLOW')
                .setDescription(toPrintAdvisories)
                .setFooter({ text: `Last update at ${time}` })
            const lm = messages.first()
            if (lm == null || !lm.author.bot) { //no message at all or last message not by bot
                channel.send({ embeds: [alertEmbed, advisoryEmbed] });
            } else {
                lm.edit({ embeds: [alertEmbed, advisoryEmbed] });
            }
        })
    })
}