// 사용자가 !daily를 하면 다음과 같이 작동
// 1. 먼저 사용자가 이미 시간을 등록했는지 확인하기 위해 쿼리 실행
// 2-a. 이미 있으면 "?시 ?분으로 알림이 설정된 상태입니다. 변경하시겠습니까 (버튼 메시지, 예/아니오)" 메시지 보내기
// 2-b. 없으면 바로 시간 입력 단계로 넘어가기
// 3. 사용자에게 입력 받기 "원하시는 시간을 24시간제로 다음과 같이 입력해주세요. (HH MM), 취소를 원하실 경우 X를 입력해주세요"
// 4. 형식이 잘못되면 오류 메시지 및 "다시 입력해주세요".
// 5. 쿼리 실행 후 등록


const { getConnection } = require('../database/connect');
const logger = require("../logger")

async function getUserCron(author, message, userCommandStatus){
    const conn = await getConnection();

    try{
        await conn.beginTransaction()
        logger.verbose("DB Begin Transaction. 이미 존재하는 BOJ ID 탐색")

        const [existingID] = await conn.execute('SELECT boj_id FROM registered_user WHERE discord_id = ?', [author.id]);
        //현재 등록하고자 하는 백준 ID가 이미 있는지 확인
        logger.info(`request id: ${author.id} / returned rows: ${JSON.stringify(existingID, null, 2)}`);

        if (existingID.length < 1) { //이미 있다면
            message.reply("백준 아이디를 등록하지 않았아요. !register을 통해 아이디를 등록해주세요");
            return;
        }


        const [rows] = await conn.execute('SELECT cron FROM user_cron WHERE discord_id = ?', [author.id])
        logger.info(`request id: ${author.id} / returned rows: ${JSON.stringify(rows, null, 2)}`);

        if (rows.length > 0) {
            const [hour, min] = rows[0].cron.split(' ');
            message.reply(`${hour}시 ${min}분으로 알림이 설정된 상태입니다. 변경하시겠습니까? (y/n)`);

            const responseFilter = m => !m.author.bot && m.author.id === message.author.id && !m.content.startsWith('!') && (m.content === 'y' || m.content === 'n');
            const responseCollector = message.channel.createMessageCollector({filter: responseFilter,max:1, time: 20000});

            responseCollector.on('collect', async msg => {
                if (msg.content === 'y'){
                    askForTime(message, userCommandStatus, conn, 1);
                }else if (msg.content === 'n'){
                    message.reply("변경을 취소하셨습니다.")
                }
                responseCollector.stop();
            });

            responseCollector.on('end', collected => {
                userCommandStatus[message.author.id] = false;

                //시간 초과되면 종료
                if (collected.size === 0) {
                    message.channel.send("아직 입력해주시지 않아 시간이 만료되었어요.");
                }
            });

        } else {
            askForTime(message, userCommandStatus, conn, 0);
        }
    }catch (error){
        if (conn) await conn.rollback();
        logger.error(`Error: ${error} / ${author.id}`)
    }finally {
        if (conn) await conn.release();
    }

}


function askForTime(message, userCommandStatus, conn, isAltering) {
    message.channel.send("원하시는 시간을 24시간제로 다음과 같이 입력해주세요. (HH MM), 취소를 원하실 경우 '취소'를 입력해주세요.");

    const botFilter = m => !m.author.bot && m.author.id === message.author.id && !m.content.startsWith('!');
    const idCollector = message.channel.createMessageCollector({filter: botFilter,max:1, time: 20000});

    idCollector.on('collect', async msg => {
        const cronMsg = msg.content;
        if (cronMsg === '취소'){
            message.reply("명령을 취소하셨습니다.")
            return;
        }

        const isCronInserted = await insertUserCron(message.author.id, cronMsg, conn, isAltering)

        logger.verbose(`Collected Message by ${msg.author.username}: ${msg.content}, ${isCronInserted}`)
        if (isCronInserted === 0){
            const [hour, min] = cronMsg.split(' ')
            message.channel.send(`성공적으로 등록되었습니다. 설정한 시간: ${hour}시 ${min}분`)
        }else{
            if (isCronInserted === -1){
                message.channel.send("알 수 없는 오류가 발생했습니다.")
            }else if (isCronInserted === -2){
                message.reply("시간 형식이 올바르지 않습니다. 올바른 형식으로 입력해주세요. (ex. 오전 1시 1분: 01 01)")
            }
        }
        //백준 ID를 입력했으면 아이디 콜렉터 종료
        idCollector.stop();
    });

    idCollector.on('end', collected => {
        userCommandStatus[message.author.id] = false;

        //시간 초과되면 종료
        if (collected.size === 0) {
            message.channel.send("아직 입력해주시지 않아 시간이 만료되었어요.");
        }
    });

}

async function insertUserCron(discordId, userInput, conn, isAltering) {
    const [hour, minute] = userInput.split(' ');

    if (hour.length !== 2 || minute.length !== 2) {
        return -2;
    }

    if (isNaN(hour) || isNaN(minute) || parseInt(hour, 10) < 0 || parseInt(hour, 10) >= 24 || parseInt(minute, 10) < 0 || parseInt(minute, 10) >= 60) {
        return -2;
    }

    const norm_hour = parseInt(hour, 10)
    const norm_min = parseInt(minute, 10)

    const userCron = `${norm_hour} ${norm_min}`
    try{
        if (!isAltering){
            await conn.execute('INSERT INTO user_cron(discord_id, cron) VALUES(?, ?)', [discordId, userCron]);
        }else{
            await conn.execute('UPDATE user_cron SET cron = ? where discord_id = ?', [userCron, discordId]);
        }

        const [rows] = await conn.execute('SELECT cron FROM user_cron WHERE discord_id = ?', [discordId])
        logger.info(`${discordId} / returned rows: ${JSON.stringify(rows, null, 2)}`);
        return 0;
    }catch (error){
        logger.error(`Error on daily func : ${error}`)
        await conn.rollback();
        return -1; //알 수 없는 오류 발생
    }
}

module.exports = {
    name: 'daily',
    async execute(message, userCommandStatus, args) {
        const { author } = message;
        await getUserCron(author, message, userCommandStatus);

    }
};

