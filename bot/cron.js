const { getConnection } = require('../database/connect')
const { getRandomProblem } = require('../commands/random')
const logger = require("../logger")
async function sendRandomMessage(client) {
    let conn;
    try {
        conn = await getConnection();
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

        const [users] = await conn.execute('SELECT discord_id FROM user_cron WHERE cron = ?',[currentTime]);

        if (!users || users.length === 0) {
            logger.verbose(`No user registered on ${currentTime}`)
            return;
        }

        for (let user of users) {
            logger.verbose(`Target user notified: ${user.discord_id}`)
            const randProblem = await getRandomProblem()
            const randProblemMsg = randProblem.getEmbedMsg("일일 문제입니다.")

            const targetUser = await client.users.fetch(user.discord_id)
            targetUser.send({embeds: [randProblemMsg]})
            logger.info(`Send Problem to user ${user.discord_id}`)
        }
        await conn.commit();

    }catch (error) {
        logger.error(`Error on cron func: ${error}`);
        if (conn) await conn.rollback();
    } finally {
        if (conn) conn.release();
    }

}

module.exports = { sendRandomMessage }