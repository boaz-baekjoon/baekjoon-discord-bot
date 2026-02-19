import { getRecommendedProblem } from '../services/recommendation.js';
import { logger } from '../logger.js';
import { UserRepository } from "../services/user-repository.js";
import { Client } from "discord.js";

export async function sendDailyProblem(client: Client): Promise<void> {
    try {
        const currentDate = new Date();
        const currentTime = `${currentDate.getHours()} ${currentDate.getMinutes()}`;
        const users = await UserRepository.findByDailyTime(currentTime);

        for (const user of users) {
            try {
                const randProblem = await getRecommendedProblem(user.boj_id);
                randProblem.hideTags();
                const randProblemMsg = randProblem.getEmbedMsg(`일일 문제: ${randProblem.problemId} - ${randProblem.title}`);

                const targetUser = await client.users.fetch(user.discord_id);
                await targetUser.send({embeds: [randProblemMsg]});
                logger.info(`Send Problem to user ${user.discord_id} / ${user.boj_id}`);
            } catch (error) {
                logger.error(`Error sending daily problem to ${user.discord_id}: ${error}`);
            }
        }
    } catch (error) {
        logger.error(`Error on cron func: ${error}`);
    }
}
