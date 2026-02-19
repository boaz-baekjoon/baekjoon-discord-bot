import { embedWelcome } from '../embeds/guide.js';
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import type { BotCommand } from "../types.js";

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('도움말을 보여줍니다.'),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply({embeds: [embedWelcome]});
    }
} satisfies BotCommand;
