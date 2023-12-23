import {embedWelcome} from '../bot/guideMessage';
import {Message} from "discord.js";

module.exports = {
    name: 'Daily Notification',
    execute(message: Message) {
        message.channel.send({embeds: [embedWelcome]})
    },
};