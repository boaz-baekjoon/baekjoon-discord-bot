//TODO 백준 아이디 변경

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
            message.reply("아직 입력해주시지 않아 시간이 만료되었어요.")
        }
    })
}

async function registerId(conn, message) {
    const response = discord_util.addBojId(conn, discordId)
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
                    }else if (msg.content === '삭제'){
                        await discord_util.deleteBojId(conn, message.author.id)
                    }else if (msg.content === '취소'){
                        message.reply("명령을 취소하셨습니다.");
                    }
                })
                responseCollector.on('end', collected => {
                    userCommandStatus[message.author.id] = false;
                    if (collected.size === 0){
                        message.reply("아직 입력해주시지 않아 시간이 만료되었어요.")
                    }
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



"message.reply(`${message.author.toString()}님. 백준 ID를 입력해주세요!`)\n" +
"            const botFilter = m => !m.author.bot && m.author.id === message.author.id && !m.content.startsWith('!');\n" +
"            //Bot이 자체적으로 전송하는 메시지를 거르고, '!'로 시작하며 해당 명령어를 친 사용자 명령어만 받아야함.\n" +
"            const idCollector = message.channel.createMessageCollector({filter: botFilter,max:1, time: 20000});\n" +
"            //메시지 콜렉터 생성. 최대 한 개의 백준 ID만 받으며 제한시간은 20초\n" +
"\n" +
"            idCollector.on('collect', async msg => {\n" +
"                const bojId = msg.content;\n" +
"                const queryMessage = await registerId(msg.author.id, bojId)\n" +
"\n" +
"                console.log(`Collected Message by ${msg.author.username}: ${msg.content}`)\n" +
"                message.reply(queryMessage)\n" +
"                //백준 ID를 입력했으면 아이디 콜렉터 종료\n" +
"                idCollector.stop();\n" +
"            });\n" +
"\n" +
"            idCollector.on('end', collected => {\n" +
"                userCommandStatus[message.author.id] = false;\n" +
"\n" +
"                //시간 초과되면 종료\n" +
"                if (collected.size === 0) {\n" +
"                    message.reply(\"아직 입력해주시지 않아 시간이 만료되었어요.\");\n" +
"                }"