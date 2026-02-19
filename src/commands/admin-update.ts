import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { UserRepository } from "../services/user-repository.js";
import { logger } from "../logger.js";
import { readFileSync } from "fs";
import type { BotCommand } from "../types.js";

export default {
    data: new SlashCommandBuilder()
        .setName('adminupdate')
        .setDescription('ADMIN UPDATE LOG COMMAND'),

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            if (interaction.user.id !== process.env.ADMIN_ID) {
                await interaction.reply("권한이 없습니다.");
                return;
            }
            const updateLog = readFileSync('./assets/updatelog.txt', 'utf8');
            await interaction.reply("업데이트 사항을 전송합니다.");
            await interaction.followUp(updateLog);
            const users = await UserRepository.findAll();
            for (const user of users) {
                try {
                    const targetUser = await interaction.client.users.fetch(user.discord_id);
                    await targetUser.send(updateLog);
                } catch (error) {
                    logger.error(error);
                }
            }
        } catch (error) {
            logger.error(error);
        }
    }
} satisfies BotCommand;
