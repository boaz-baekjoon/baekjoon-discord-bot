import axios from 'axios'
import {BojProblem, getProblemErrorMsg} from "../model/problem_class.js";
import {logger} from '../logger.js'
import {ModelUtil} from "../util/modelUtil.js";
import {MongoUtil} from "../util/mongoUtil.js";
import {ChatInputCommandInteraction, Message, SlashCommandBuilder} from "discord.js";

export async function getRecommendedProblem(user_id: string) {
    try{
        const problem_arr = await ModelUtil.getSingleProblem(user_id,1)
        if (problem_arr.length === 0){
            logger.warn(`${user_id}/ 모델 서버 오류로 인한 랜덤 문제 반환`)
            return await getRandomProblem()
        }
        return await MongoUtil.findProblemWithProblemId(problem_arr[0]);
    }catch(error){
        logger.error(error);
        logger.warn(`${user_id}/ 모델 서버 오류로 인한 랜덤 문제 반환`);
        return await getRandomProblem();
    }
}

export async function getRandomProblem() {
    for (let i = 0; i < 5; i++) {
        try {
            const randomId = Math.floor(Math.random() * (28415 - 1000)) + 1000;
            const bojProblem = await MongoUtil.findProblemWithProblemId(randomId);
            if (bojProblem) {
                return bojProblem;
            }else {
                logger.warn(`${randomId}번은 없는 문제. 재시도 ${i+1}`);
            }
        } catch (error) {
            logger.error(error);
        }
    }
    return getProblemErrorMsg();
}

export default {
    data: new SlashCommandBuilder()
    .setName('prob')
    .setDescription('즉시 문제를 추천받습니다.'),

    async execute(interaction: ChatInputCommandInteraction){
        try{
            const user = await MongoUtil.findUserWithDiscordId(interaction.user.id);
            if (!user) { //없다면
                await interaction.reply("백준 아이디를 등록하지 않았습니다. /register을 통해 아이디를 등록해주세요");
                return;
            }
            const randProblem = await getRecommendedProblem(user['boj_id']);
            await interaction.reply({embeds: [randProblem.getEmbedMsg("개인 맞춤형 문제입니다.")]});
        }catch (error){
            logger.error(error)
            await interaction.reply("알 수 없는 오류가 발생했습니다.")
        }
    }
}