import axios from "axios";
import { Client, MessageEmbed, TextChannel } from "discord.js";
import { BOT } from "../config";

function sanitizeHTML(str: string) {
    // remove class properties to make sanitizing easier
    str = str.replace(/ (class|href)=(.+?)(?=>)/g, '');
    
    // further preparations
    str = str.replace('<a >', '<a>');

    // replace tags or asterisks with markdown or nothing
    str = str.replace(/<p>|<a>|<\/a>|<ul>|<li>|<\/ul>|<\/li>|<br \/>|\*+/g, '');
    str = str.replace(/<\/p>/g, '\n\n');
    str = str.replace(/<strong>|<\/strong>/g, '**');
    str = str.replace(/<em>|<\/em>/g, '*');
    str = str.replace(/<h3>/g, '__**');
    str = str.replace(/<\/h3>/g, '**__\n');
    return str;
}

export function lookupAlerts(client: Client) {
    let toPrint = "";
    let index = 0;

    axios.get("http://www3.septa.org/hackathon/Alerts/")
    .then((res) => {
        if (BOT.alerts.length === 0) toPrint = "You are not tracking any lines for alerts.";
        const filteredData = res.data.filter((alert) => BOT.alerts.includes(alert.route_name));
        for (const alert of filteredData) {
            if (!alert.alert) toPrint += `*There are no alerts on the ${alert.route_name} line.*\n\n`;
            else {
                toPrint += `***There are alerts on the ${alert.route_name} line.***\n`
                toPrint += sanitizeHTML(alert.alert) + `\n\n`;
            }

            if (!alert.advisory) toPrint += `*There are no advisories on the ${alert.route_name} line.*\n\n`;
            else {
                toPrint += `***There are advisories on the ${alert.route_name} line.***\n`
                toPrint += sanitizeHTML(alert.advisory);
            }
        }

        const guild = client.guilds.cache.get(BOT.GUILD_ID);
	    const channel = guild.channels.cache.get(BOT.SEND_ALERTS_TO) as TextChannel;

        channel.messages.fetch({ limit: 1 }).then(messages => { //get only the last message sent
            const trainEmbed = new MessageEmbed()
                .setColor('BLURPLE')
                .setTitle('SEPTA Information Board')
                .setDescription(toPrint)
            const lm = messages.first()
            if (lm == null || !lm.author.bot) { //no message at all or last message not by bot
                channel.send({ embeds: [trainEmbed] });
            } else {
                lm.edit({ embeds: [trainEmbed] });
            }
        })
    })
}