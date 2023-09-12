const mysql = require('mysql2/promise');
const dotenv = require("dotenv");
const logger = require("../logger")

dotenv.config();

const pool = mysql.createPool({
    host: process.env.RDS_ENDPOINT,
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    database: 'boj_bot_db',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 40,
    queueLimit: 0,
    connectTimeout: 4500
});


const getConnection = async () => { //Pool 커넥션 불러오기
    try {
        return await pool.getConnection();
    } catch (error) {
        logger.error(`connection error : ${error.message}`);
        return null;
    }
}

async function getBojID(conn, discord_id){
    try{
        const [boj_id] = await conn.execute('SELECT boj_id FROM registered_user WHERE discord_id = ?', [discord_id]);
        logger.info(`request id: ${discord_id} / returned rows: ${JSON.stringify(boj_id, null, 2)}`);
        return boj_id;
    }catch (error){
        logger.error(error.message)
        return [];
    }
}

async function modifyBojId(conn, discord_id){}

async function deleteBojId(conn, discord_id){}

async function getCronWithDiscordId(conn, discord_id) {
    const [rows] = await conn.execute('SELECT cron FROM user_cron WHERE discord_id = ?', [discord_id])
    logger.info(`request id: ${discord_id} / returned rows: ${JSON.stringify(rows, null, 2)}`);
    return rows

}

async function insertCron(conn, discord_id, userCron){
    try{
        await conn.execute('INSERT INTO user_cron(discord_id, cron) VALUES(?, ?)', [discord_id, userCron]);
        const [cron_response] = await conn.execute('SELECT cron FROM user_cron WHERE discord_id = ?', [discord_id])

        if (cron_response[0]["cron"] === userCron){
            logger.info(`${discord_id} / returned rows: ${JSON.stringify(cron_response, null, 2)}`);
            return cron_response
        }else{
            return []
        }
    }catch (error){
        logger.error(error.message)
    }
}
async function modifyCron(conn, discord_id, userCron){

}

async function deleteCron(conn, discord_id){
    try{
        logger.info(`Deleting cron of ${discord_id}`)
        await conn.execute('DELETE FROM user_cron WHERE discord_id = ?', [discord_id]);
        return 0;
    }catch(error){
        logger.error(error)
        return -1;
    }
}

module.exports = { getConnection, getBojID, modifyBojId, deleteBojId, getCronWithDiscordId,insertCron, modifyCron, deleteCron}