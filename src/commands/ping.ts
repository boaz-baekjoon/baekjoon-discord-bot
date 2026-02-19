import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import type { BotCommand } from "../types.js";

export default {
    data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply('Pong!');
    }
} satisfies BotCommand;
