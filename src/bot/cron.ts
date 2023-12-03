import { DiscordQueryRunner } from '../util/discord_db';
import { getRecommendedProblem } from '../commands/prob'
import { logger}  from '../logger'

export async function sendDailyProblem(client) {
    let conn;
    try {
        conn = await DiscordQueryRunner.getConnection();
        logger.verbose(conn)

        if (!conn) {
            logger.error("Failed to get connection");
            return;
        }

        await conn.beginTransaction()

        const currentHour = new Date().getHours();
        const currentMinute = new Date().getMinutes();
        const currentTime = `${currentHour} ${currentMinute}`
        logger.verbose(`Time Switched: ${currentTime}`)

        const users = await DiscordQueryRunner.getUserWithCurrentCron(conn, currentTime)

        for (let user of users) {
            logger.verbose(`Target user notified: ${user.boj_id}`)
            const randProblem = await getRecommendedProblem(user.boj_id)
            const randProblemMsg = randProblem.getEmbedMsg(`일일 문제: ${randProblem.getProblemId()} - ${randProblem.getTitle()}`)

            const targetUser = await client.users.fetch(user.discord_id)
            targetUser.send({embeds: [randProblemMsg]})
            logger.info(`Send Problem to user ${user.discord_id} / ${user.boj_id}`)
        }
        await conn.commit();

    }catch (error) {
        logger.error(`Error on cron func: ${error}`);
        if (conn) await conn.rollback();
    } finally {
        if (conn) conn.release();
    }

}