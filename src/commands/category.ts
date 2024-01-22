import {Message} from "discord.js";
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

export async function execute(message: Message){
    try{
        await message.channel.send({embeds: [categoryList]});

        const botFilter = (m: { author: { bot: any; id: string; }; content: string; }) => !m.author.bot && m.author.id === message.author.id
            && !m.content.startsWith('!');
        const responseCollector = message.channel.createMessageCollector({filter: botFilter,max:1, time: 20000});

        responseCollector.on('collect', async msg => {
            const selectedNumber = parseInt(msg.content);
            //만일 숫자가 아니거나 0~10 사이의 숫자가 아니라면
            if (isNaN(selectedNumber) || selectedNumber < 0 || selectedNumber > 10){
                await message.reply("숫자를 잘못 입력하셨습니다. 명령을 취소합니다.");
                return;
            }
            if(selectedNumber === 10){
                await message.reply("명령을 취소하셨습니다.");
                return;
            }

            const problem = await getProblemWithCategory(message.author.id, selectedNumber);
            await message.channel.send({embeds: [problem.getEmbedMsg("개인 맞춤형 문제입니다.")]})
        });

        responseCollector.on('end', collected => {
            if (collected.size === 0){
                message.reply("입력 시간이 만료되었습니다.")
            }
        });
    }catch (error){
        logger.error(error);
        await message.reply("알 수 없는 오류가 발생했습니다.")
    }
}