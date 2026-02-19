import { ReportRepository } from "../services/report-repository.js";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { logger } from "../logger.js";
import type { BotCommand } from "../types.js";

export default {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('버그나 개선사항을 제보합니다.')
        .addStringOption(option => option.setName('content').setDescription('내용을 입력해주세요. 모든 피드백은 익명으로 개발자에게 전달됩니다.').setRequired(true)),

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const content = interaction.options.getString('content', true);
            const result = await ReportRepository.insert(content);
            if (result) {
                await interaction.reply("정상적으로 전달되었습니다. 소중한 피드백 감사합니다.");
            } else {
                await interaction.reply("알 수 없는 오류가 발생했습니다.");
            }
        } catch (error) {
            await interaction.reply("알 수 없는 오류가 발생했습니다.");
            logger.error(error);
        }
    }
} satisfies BotCommand;
