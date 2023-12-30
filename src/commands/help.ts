import {embedWelcome} from '../bot/guideMessage.js';
import {Message} from "discord.js";

async function execute(message: Message){
    message.channel.send({embeds: [embedWelcome]})
}
