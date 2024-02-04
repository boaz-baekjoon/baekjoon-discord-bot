import {ChatInputCommandInteraction, Message, SlashCommandBuilder, TextChannel} from "discord.js";
import {categoryList} from "../embedMessage/categoryMessage.js";
import {ModelUtil} from "../util/modelUtil.js";
import {MongoUtil} from "../util/mongoUtil.js";
import {logger} from "../logger.js";
import {getRandomProblem} from "./prob.js";

async function getProblemWithCategory(user_id: string, category: number) {
    try{
        const problem_arr = await ModelUtil.getProblemWithCategory(user_id, category);
        if (problem_arr.length === 0){
            logger.warn(`${user_id}/ 모델 서버 오류로 인한 랜덤 문제 반환`)
            return await getRandomProblem()
        }
        return await MongoUtil.findProblemWithProblemId(problem_arr[0]);
    }catch(error){
        logger.error(error);
        return await getRandomProblem();
    }
}

export default{
    data: new SlashCommandBuilder()
        .setName('category')
        .setDescription('카테고리별 문제를 받습니다.')
        .addStringOption(option => option.setName('category').setDescription('카테고리 번호를 입력해주세요.').setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction){
        try{
            const number = interaction.options.getString('category');
            if (number === null || parseInt(number) === null || parseInt(number) > 10 || parseInt(number) < 1){
                await interaction.reply({embeds: [categoryList]});
                await interaction.followUp("정확한 카테고리 번호를 입력해주세요.")
                return;
            }
            const problem = await getProblemWithCategory(interaction.user.id, parseInt(number));
            await (interaction.channel as TextChannel).send({embeds: [problem.getEmbedMsg("개인 맞춤형 문제입니다.")]})
            await interaction.reply("카테고리별 문제를 전송했습니다.")
        }catch (error){
            logger.error(error);
            await interaction.reply("알 수 없는 오류가 발생했습니다.")
        }
    }
}
