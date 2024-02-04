import {ChatInputCommandInteraction, CommandInteraction, SlashCommandBuilder} from "discord.js";

export default {
    data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
    async execute(interaction: ChatInputCommandInteraction) {
        console.log('input')

        await interaction.reply('Pong!');
    }
}