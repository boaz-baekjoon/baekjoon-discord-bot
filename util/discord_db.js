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

async function getDiscordIdWithCron(conn, discord_id) {}

async function modifyCron(conn, discord_id){}

async function deleteCron(conn, discord_id){}

module.exports = { getConnection, getBojID, modifyBojId, deleteBojId, getDiscordIdWithCron, modifyCron, deleteCron}