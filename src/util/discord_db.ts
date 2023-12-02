import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import {logger} from '../logger';

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

export class DiscordQueryRunner{
    static async getConnection() { //Pool 커넥션 불러오기
        try {
            return await pool.getConnection();
        } catch (error) {
            logger.error(`connection error : ${error.message}`);
            return null;
        }
    }

    static async getBojID(conn, discordId){
        try{
            const [boj_id] = await conn.execute('SELECT boj_id FROM registered_user WHERE discord_id = ?', [discordId]);
            logger.info(`request id: ${discordId} / returned rows: ${JSON.stringify(boj_id, null, 2)}`);
            return boj_id;
        }catch (error){
            logger.error(error.message)
            return [];
        }
    }

    static async addBojId(conn, discordId, bojId){
        try{
            await conn.execute('INSERT INTO registered_user(discord_id, boj_id) VALUES(?, ?)', [discordId, bojId]);
            await conn.commit();
            logger.info(`adding BOJ ID, request: ${discordId}, registered id: ${bojId}`)
            return true;
        }catch(error){
            logger.error(error.message);
            await conn.rollback();
            return false
        }
    }

    static async modifyBojId(conn, discordId, bojId){
        try{
            await conn.execute('UPDATE registered_user SET boj_id = ? where discord_id = ?', [bojId, discordId]);
            await conn.commit();
            return true;
        }catch(error){
            logger.error(error.message);
            await conn.rollback();
            return false;
        }
    }

    static async deleteBojId(conn, discordId){
        try{
            logger.info(`Deleting bojId of ${discordId}`)
            await conn.execute('DELETE FROM registered_user WHERE discord_id = ?', [discordId]);
            await conn.commit();
            return true;
        }catch(error){
            logger.error(error)
            await conn.rollback();
            return false;
        }
    }

    static async getUserWithCurrentCron(conn, currentTime){
        try{
            const [users] = await conn.execute('SELECT * FROM registered_user WHERE discord_id IN ' +
                '(SELECT discord_id from user_cron where cron = ?)',[currentTime]);

            if (!users || users.length === 0) {
                logger.verbose(`No user registered on ${currentTime}`)
                return [];
            }
            return users;
        }catch(error){
            logger.error(error);
            return [];
        }
    }

    static async getCronWithDiscordId(conn, discordId) {
        try{
            const [rows] = await conn.execute('SELECT cron FROM user_cron WHERE discord_id = ?', [discordId])
            logger.info(`request id: ${discordId} / returned rows: ${JSON.stringify(rows, null, 2)}`);
            return rows
        }catch(error){
            logger.error(error.message)
            return []
        }
    }

    static async insertCron(conn, discordId, userCron){
        try{
            await conn.execute('INSERT INTO user_cron(discord_id, cron) VALUES(?, ?)', [discordId, userCron]);
            const [cron_response] = await conn.execute('SELECT cron FROM user_cron WHERE discord_id = ?', [discordId])

            if (cron_response[0]["cron"] === userCron){
                logger.info(`${discordId} / returned rows: ${JSON.stringify(cron_response, null, 2)}`);
                await conn.commit();
                return cron_response
            }else{
                await conn.rollback();
                return []
            }
        }catch (error){
            await conn.rollback();
            logger.error(error.message)
        }
    }
    static async modifyCron(conn, discordId, userCron){
        try{
            await conn.execute('UPDATE user_cron SET cron = ? where discord_id = ?', [userCron, discordId]);
            await conn.commit();
        }catch(error){
            await conn.rollback();
            logger.error(error.message)
        }
    }

    static async deleteCron(conn, discordId){
        try{
            logger.info(`Deleting cron of ${discordId}`)
            await conn.execute('DELETE FROM user_cron WHERE discord_id = ?', [discordId]);
            await conn.commit();
            return 0;
        }catch(error){
            logger.error(error)
            await conn.rollback();
            return -1;
        }
    }

}
