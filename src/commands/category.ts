import { ChatInputCommandInteraction, SlashCommandBuilder, TextChannel } from "discord.js";
import { categoryList } from "../embeds/category-list.js";
import { ModelApi } from "../services/model-api.js";
import { ProblemRepository } from "../services/problem-repository.js";
import { logger } from "../logger.js";
import { getRandomProblem } from "../services/recommendation.js";
import { BojProblem } from "../models/problem.js";
import type { BotCommand } from "../types.js";

async function getProblemWithCategory(interaction: ChatInputCommandInteraction, category: number): Promise<BojProblem> {
    try {
        const problemArr = await ModelApi.getProblemWithCategory(interaction.user.id, category);
        if (problemArr.length === 0) {
            await interaction.reply("모델 서버의 오류로 인해 랜덤 문제를 반환합니다.");
            logger.warn(`${interaction.user.id}/ 모델 서버 오류로 인한 랜덤 문제 반환`);
            return await getRandomProblem();
        }
        const problem = await ProblemRepository.findByProblemId(problemArr[0]);
        return problem ?? await getRandomProblem();
    } catch (error) {
        logger.error(error);
        return await getRandomProblem();
    }
}

export default {
    data: new SlashCommandBuilder()
        .setName('category')
        .setDescription('카테고리별 문제를 받습니다.')
        .addStringOption(option => option.setName('category').setDescription('카테고리 번호를 입력해주세요. 번호 목록은 /categorylist를 통해 확인해주세요.').setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const numberStr = interaction.options.getString('category', true);
            const num = parseInt(numberStr, 10);
            if (isNaN(num) || num > 9 || num < 0) {
                await interaction.reply({embeds: [categoryList]});
                await interaction.followUp("정확한 카테고리 번호를 입력해주세요.");
                return;
            }
            const problem = await getProblemWithCategory(interaction, num);
            if (interaction.channel) {
                await (interaction.channel as TextChannel).send({embeds: [problem.getEmbedMsg("개인 맞춤형 문제입니다.")]});
            }
            await interaction.reply("카테고리별 문제를 전송했습니다.");
        } catch (error) {
            logger.error(error);
            await interaction.reply("알 수 없는 오류가 발생했습니다.");
        }
    }
} satisfies BotCommand;
