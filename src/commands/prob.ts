import { BojProblem } from "../models/problem.js";
import { logger } from '../logger.js';
import { UserRepository } from "../services/user-repository.js";
import { getRecommendedProblem } from "../services/recommendation.js";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import type { BotCommand } from "../types.js";

export default {
    data: new SlashCommandBuilder()
        .setName('prob')
        .setDescription('즉시 문제를 추천받습니다.'),

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const user = await UserRepository.findByDiscordId(interaction.user.id);
            if (!user) {
                await interaction.reply("백준 아이디를 등록하지 않았습니다. /register을 통해 아이디를 등록해주세요");
                return;
            }
            const randProblem: BojProblem = await getRecommendedProblem(user.boj_id);
            randProblem.hideTags();
            await interaction.reply({embeds: [randProblem.getEmbedMsg("개인 맞춤형 문제입니다.")]});
        } catch (error) {
            logger.error(error);
            await interaction.reply("알 수 없는 오류가 발생했습니다.");
        }
    }
} satisfies BotCommand;
