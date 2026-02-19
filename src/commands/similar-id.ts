import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { ModelApi } from "../services/model-api.js";
import { logger } from "../logger.js";
import { ProblemRepository } from "../services/problem-repository.js";
import type { BotCommand } from "../types.js";

async function getSimilarProblem(problemId: number): Promise<number | null> {
    try {
        const problemArr = await ModelApi.getSimilarProbWithId(problemId);
        if (problemArr.length === 0) {
            return null;
        }
        return problemArr[0];
    } catch (error) {
        logger.error(error);
        return null;
    }
}

export default {
    data: new SlashCommandBuilder()
        .setName('similarid')
        .setDescription('유사한 문제를 받습니다.')
        .addStringOption(option => option.setName('problem_id').setDescription('유사한 문제를 받고 싶으신 백준 문제의 번호를 입력해주세요.').setRequired(true)),

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const problemIdStr = interaction.options.getString('problem_id', true);
            const problemId = parseInt(problemIdStr, 10);
            if (isNaN(problemId)) {
                await interaction.reply("올바른 문제 번호를 입력해주세요.");
                return;
            }
            const similarProblemId = await getSimilarProblem(problemId);
            if (similarProblemId === null) {
                await interaction.reply("입력하신 문제 번호에 해당하는 문제가 없습니다.");
                return;
            }
            const problem = await ProblemRepository.findByProblemId(similarProblemId);
            if (!problem) {
                await interaction.reply("입력하신 문제 번호에 해당하는 문제가 없습니다.");
                return;
            }
            await interaction.reply({embeds: [problem.getEmbedMsg("유사 문제입니다.")]});
        } catch (error) {
            logger.error(error);
            await interaction.reply("알 수 없는 오류가 발생했습니다.");
        }
    }
} satisfies BotCommand;
