import { getRecommendedProblem } from '../commands/prob'
import { logger}  from '../logger'
import {MongoUtil} from "../util/mongoUtil";
import {Client} from "discord.js";

export async function sendDailyProblem(client: Client) {
    try {
        const currentDate = new Date()
        const currentTime = `${currentDate.getHours()} ${currentDate.getMinutes()}`
        const users = await MongoUtil.findUserWithUserDailyTime(currentTime);

        for (let user of users) {
            const randProblem = await getRecommendedProblem(user['boj_id'])
            const randProblemMsg = randProblem.getEmbedMsg(`일일 문제: ${randProblem.problemId} - ${randProblem.title}`)

            const targetUser = await client.users.fetch(user.discord_id)
            await targetUser.send({embeds: [randProblemMsg]})
            logger.info(`Send Problem to user ${user.discord_id} / ${user.boj_id}`)
        }
    }catch (error) {
        logger.error(`Error on cron func: ${error}`);
    }
}