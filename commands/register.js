const discord_util = require('../util/discord_db')
const logger = require('../logger')


async function alterId(conn, message) {
    message.reply("아이디를 입력해주세요.")
    const botFilter = m => !m.author.bot && m.author.id === message.author.id && !m.content.startsWith('!');
    const idCollector = message.channel.createMessageCollector({filter: botFilter,max:1, time: 20000});
    idCollector.on('collect', async msg => {
        const bojId = msg.content;
        const response = discord_util.modifyBojId(conn, message.author.id, bojId);
        if (response){
            message.reply("정상적으로 변경되었습니다.")
        }else{
            message.reply("알 수 없는 오류가 발생했습니다.")
        }
    })
    idCollector.on('end', collected => {
        if (collected.size === 0){
            message.reply("입력 시간이 만료되었습니다.")
        }
    })
}

async function registerId(conn, message) {
    message.reply("아이디를 입력해주세요.");
    const botFilter = m => !m.author.bot && m.author.id === message.author.id && !m.content.startsWith('!');
    const idCollector = message.channel.createMessageCollector({filter: botFilter,max:1, time: 20000});
    idCollector.on('collect', async msg => {
        const bojId = msg.content;
        const response = discord_util.addBojId(conn, message.author.id, bojId);
        if (response){
            message.reply("정상적으로 등록되었습니다.")
        }else{
            message.reply("알 수 없는 오류가 발생했습니다.")
        }
    })
    idCollector.on('end', collected => {
        if (collected.size === 0){
            message.reply("입력 시간이 만료되었습니다.")
        }
    })
}


module.exports = {
    name: '아이디 등록',
    async execute (message, userCommandStatus, args) {
        if (userCommandStatus[message.author.id]) { //해당 사용자가 이미 다른 명령어를 실행하고 있는 경우
            return;
        }
        let conn;
        try{
            userCommandStatus[message.author.id] = true; //명령어를 실행하는 상태로 전환

            conn = await discord_util.getConnection()
            const response = await discord_util.getBojID(conn, message.author.id)


            if (response.length > 0){
                message.reply(`이미 ${response[0]['boj_id']}로 등록이 된 상태입니다. 변경하시려면 '변경', 삭제하시려면 '삭제'를 입력해주세요. 명령어를 취소하려면 '취소'를 입력해주세요.`)

                const botFilter = m => !m.author.bot && m.author.id === message.author.id && !m.content.startsWith('!') && (m.content === '변경' || m.content === '삭제' || m.content === '취소');
                const responseCollector = message.channel.createMessageCollector({filter: botFilter,max:1, time: 20000});

                responseCollector.on('collect', async msg => {
                    if (msg.content === '변경'){
                        await alterId(conn, message)
                        userCommandStatus[message.author.id] = false
                    }else if (msg.content === '삭제'){
                        const response = await discord_util.deleteBojId(conn, message.author.id)
                        if (response){
                            message.reply("정상적으로 삭제되었습니다.")
                        }else{
                            message.reply("알 수 없는 오류가 발생했습니다.")
                        }
                    }else if (msg.content === '취소'){
                        message.reply("명령을 취소하셨습니다.");
                    }
                })
                responseCollector.on('end', collected => {
                    if (collected.size === 0){
                        message.reply("입력 시간이 만료되었습니다.")
                    }
                    userCommandStatus[message.author.id] = false
                })
            }else {
                await registerId(conn, message)
            }
        }catch(error){
            logger.error(error.message)
        }finally {
            conn.release();
        }
    },
};
