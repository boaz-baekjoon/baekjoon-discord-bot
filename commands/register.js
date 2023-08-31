const { getConnection } = require('../database/connect')

async function registerId(discordId, bojId) {
    const conn = await getConnection(); //DB 연결 구축

    try {
        await conn.beginTransaction(); //트랜잭션 시작

        console.log("Searching existing ID...")

        const [rows] = await conn.execute('SELECT boj_id FROM registered_user WHERE discord_id = ?', [discordId]);
        //현재 등록하고자 하는 백준 ID가 이미 있는지 확인
        console.log(`returned rows: ${JSON.stringify(rows, null, 2)}`);

        if (rows.length > 0) { //이미 있다면
            return "이미 백준 아이디를 등록하셨습니다."; //TODO 이 부분은 나중에 백준 ID를 수정 가능하도록 바꿔야 함.
        }

        console.log("Adding BOJ ID...")
        await conn.execute('INSERT INTO registered_user(discord_id, boj_id) VALUES(?, ?)', [discordId, bojId]);

        await conn.commit();
        return "백준 아이디가 등록되었습니다.";

    } catch (error) {
        console.error('Error executing query: ' + error.message);
        await conn.rollback();
        return "오류가 발생했습니다.";

    } finally {
        conn.release();
    }
}

module.exports = {
    name: '아이디 등록',
    async execute (message, userCommandStatus, args) {
        if (userCommandStatus[message.author.id]) { //해당 사용자가 이미 다른 명령어를 실행하고 있는 경우
            return;
        }

        userCommandStatus[message.author.id] = true; //명령어를 실행하는 상태로 전환

        message.reply(`${message.author.toString()}님. 백준 ID를 입력해주세요!`)
        const botFilter = m => !m.author.bot && m.author.id === message.author.id && !m.content.startsWith('!');
        //Bot이 자체적으로 전송하는 메시지를 거르고, '!'로 시작하며 해당 명령어를 친 사용자 명령어만 받아야함.
        const idCollector = message.channel.createMessageCollector({filter: botFilter,max:1, time: 20000});
        //메시지 콜렉터 생성. 최대 한 개의 백준 ID만 받으며 제한시간은 20초

        idCollector.on('collect', async msg => {
            const bojId = msg.content;
            const queryMessage = await registerId(msg.author.id, bojId)

            console.log(`Collected Message by ${msg.author.username}: ${msg.content}`)
            message.reply(queryMessage)
            //백준 ID를 입력했으면 아이디 콜렉터 종료
            idCollector.stop();
        });

        idCollector.on('end', collected => {
            userCommandStatus[message.author.id] = false;

            //시간 초과되면 종료
            if (collected.size === 0) {
                message.reply("아직 입력해주시지 않아 시간이 만료되었어요.");
            }
        });
    },
};