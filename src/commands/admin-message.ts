import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { UserRepository } from "../services/user-repository.js";
import { logger } from "../logger.js";
import type { BotCommand } from "../types.js";

export default {
    data: new SlashCommandBuilder()
        .setName('adminmessage')
        .setDescription('ADMIN COMMAND')
        .addStringOption(option => option.setName('message').setDescription('공지사항을 입력해주세요.').setRequired(true)),

    async execute(interaction: ChatInputCommandInteraction) {
        if (interaction.user.id !== process.env.ADMIN_ID) {
            await interaction.reply("권한이 없습니다.");
            return;
        }
        await interaction.reply("메시지를 전송합니다.");
        const users = await UserRepository.findAll();
        const message = interaction.options.getString('message', true);
        for (const user of users) {
            try {
                const targetUser = await interaction.client.users.fetch(user.discord_id);
                await targetUser.send(message);
            } catch (error) {
                logger.error(error);
            }
        }
    }
} satisfies BotCommand;
