import {ChatInputCommandInteraction, Message, SlashCommandBuilder} from "discord.js";
import {ModelUtil} from "../util/modelUtil.js";
import {logger} from "../logger.js";
import {MongoUtil} from "../util/mongoUtil.js";

async function getSimilarProblem(problem_id: number) {
    try{
        const problem_arr = await ModelUtil.getSimilarProbWithId(problem_id);
        if (problem_arr.length === 0){
            return null;
        }
        return problem_arr[0];
    }catch(error){
        logger.error(error);
        return null;
    }
}

export default{
    data: new SlashCommandBuilder()
        .setName('similarid')
        .setDescription('유사한 문제를 받습니다.')
        .addStringOption(option => option.setName('problem_id').setDescription('문제 번호를 입력해주세요.').setRequired(true)),

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const problem_id = interaction.options.getString('problem_id');
            console.log(problem_id);
            const similarProblemId = await getSimilarProblem(parseInt(problem_id!));
            if (similarProblemId === null) {
                await interaction.reply("입력하신 문제 번호에 해당하는 문제가 없습니다.")
                return;
            }
            const problem = await MongoUtil.findProblemWithProblemId(similarProblemId);
            await interaction.reply({embeds: [problem.getEmbedMsg("유사 문제입니다.")]});
        } catch (error) {
            logger.error(error)
            await interaction.reply("알 수 없는 오류가 발생했습니다.")
        }
    }
}