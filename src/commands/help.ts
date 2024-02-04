import {embedWelcome} from '../embedMessage/guideMessage.js';
import {ChatInputCommandInteraction, Message, SlashCommandBuilder} from "discord.js";

export async function execute(message: Message){
    message.channel.send({embeds: [embedWelcome]})
}

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('도움말을 보여줍니다.'),
    async execute(interaction: ChatInputCommandInteraction){
        await interaction.reply({embeds: [embedWelcome]})
    }
}