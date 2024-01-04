import {embedWelcome} from '../embedMessage/guideMessage.js';
import {Message} from "discord.js";

export async function execute(message: Message){
    message.channel.send({embeds: [embedWelcome]})
}
