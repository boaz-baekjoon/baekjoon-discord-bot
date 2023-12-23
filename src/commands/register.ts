import {logger} from "../logger";
import {MongoUtil} from "../util/mongoUtil";
import {Message} from "discord.js";

async function registerId(message: Message, isUserAlreadyRegistered: boolean) {
    await message.reply("등록하실 백준 아이디를 입력해주세요.");
    const botFilter = m => !m.author.bot && m.author.id === message.author.id && !m.content.startsWith('!');
    const idCollector = message.channel.createMessageCollector({filter: botFilter,max:1, time: 20000});

    idCollector.on('collect', async msg => {
        let response: boolean;
        if(isUserAlreadyRegistered === true){
            response = await MongoUtil.modifyBojIdOfUser(message.author.id, msg.content);
        }else{
            response = await MongoUtil.addUser(message.author.id, msg.content);
        }

        if (response){
            await message.reply(isUserAlreadyRegistered ? "정상적으로 변경되었습니다." : "정상적으로 등록되었습니다.")
            logger.info(`${message.author.id} / ${msg.content} 가입 완료`)
        }else{
            await message.reply("알 수 없는 오류가 발생했습니다.")
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
    async execute (message: Message) {
        try{
            const user = await MongoUtil.findUserWithDiscordId(message.author.id);

            if (user){
                await message.reply(`이미 ${user['boj_id']}로 등록이 된 상태입니다. 변경하시려면 '변경', 삭제하시려면 '삭제'를 입력해주세요. 명령어를 취소하려면 '취소'를 입력해주세요.`)

                const botFilter = m => !m.author.bot && m.author.id === message.author.id && !m.content.startsWith('!')
                    && (m.content === '변경' || m.content === '삭제' || m.content === '취소');
                const responseCollector = message.channel.createMessageCollector({filter: botFilter,max:1, time: 20000});

                responseCollector.on('collect', async msg => {
                    switch (msg.content) {
                        case '변경':
                            await registerId(message, true);
                            break;
                        case '삭제':
                            const response = await MongoUtil.deleteUser(message.author.id);
                            if (response){
                                await message.reply("정상적으로 삭제되었습니다.")
                            }else{
                                await message.reply("알 수 없는 오류가 발생했습니다.")
                            }
                            break;
                        case '취소':
                            await message.reply("명령을 취소하셨습니다.");
                            break;
                    }
                })

                responseCollector.on('end', collected => {
                    if (collected.size === 0){
                        message.reply("입력 시간이 만료되었습니다.")
                    }
                })

            }else {
                await registerId(message, false)
            }
        }catch(error) {
            logger.error(error.message)
        }
    },
};
