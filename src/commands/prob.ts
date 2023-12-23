import axios from 'axios'
import {BojProblem, getProblemErrorMsg} from "../schema/problem";
import {logger} from '../logger'
import {modelUtil} from "../util/model_server_api";
import {MongoUtil} from "../util/mongoUtil";
import {Message} from "discord.js";

export async function getRecommendedProblem(user_id: string) {
    let bojProblem = new BojProblem(null, null, null, null);
    try{
        const problem_arr = await modelUtil.getSingleProblem(user_id,1)
        console.log(problem_arr);
        if (problem_arr.length === 0){
            logger.warn(`${user_id}/ 모델 서버 오류로 인한 랜덤 문제 반환`)
            return await getRandomProblem()
        }
        const response = await axios.get('https://solved.ac/api/v3/problem/show', {
            params: {
                problemId: problem_arr[0],
            },
        });
        bojProblem.problemId = response.data.problemId;
        bojProblem.title = response.data.titleKo;
        bojProblem.level = response.data.level;
        bojProblem.tags = response.data.tags;
    }catch(error){
        logger.error(error);
        logger.warn(`${user_id}/ 모델 서버 오류로 인한 랜덤 문제 반환`);
        bojProblem = await getRandomProblem();
    }
    return bojProblem;
}

async function getRandomProblem() {
    let bojProblem = new BojProblem(null, null, null, null);
    //TODO 현재는 숫자로 범위를 지정해줬는데, 나중에 백준 사이트를 통해 직접 문제 수를 받아야 함.
    for (let i = 0; i < 5; i++) {
        try {
            const randomId = Math.floor(Math.random() * (28415 - 1000)) + 1000;
            const response = await axios.get('https://solved.ac/api/v3/problem/show', {
                params: {
                    problemId: randomId,
                },
            });
            bojProblem.problemId = response.data.problemId;
            bojProblem.title = response.data.titleKo + " (모델 서버 오류로 인한 랜덤 문제)";
            bojProblem.level = response.data.level;
            bojProblem.tags = response.data.tags;
            console.log(response)
            return bojProblem;
        } catch (error) {
            logger.warn(`문제 요청 실패. 다시 요청 시도 (${i + 1}번쨰 시도)`)
        }
    }
    return getProblemErrorMsg("알 수 없는 오류가 발생했습니다.");
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