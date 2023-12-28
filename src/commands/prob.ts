import axios from 'axios'
import {BojProblem, getProblemErrorMsg} from "../schema/problem_class";
import {logger} from '../logger'
import {modelUtil} from "../util/modelUtil";
import {MongoUtil} from "../util/mongoUtil";
import {Message} from "discord.js";

export async function getRecommendedProblem(user_id: string) {
    try{
        const problem_arr = await modelUtil.getSingleProblem(user_id,1)
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

async function getRandomProblem() {
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

export async function execute(message: Message) {
    try{
        const user = await MongoUtil.findUserWithDiscordId(message.author.id);
        if (!user) { //없다면
            await message.reply("백준 아이디를 등록하지 않았습니다. !register을 통해 아이디를 등록해주세요");
            return;
        }
        const randProblem = await getRecommendedProblem(user['boj_id']);
        message.channel.send({embeds: [randProblem.getEmbedMsg("개인 맞춤형 문제입니다.")]});
    }catch (error){
        logger.error(error)
        await message.reply("알 수 없는 오류가 발생했습니다.")
    }
}