// 사용자가 !daily를 하면 다음과 같이 작동
// 1. 먼저 사용자가 이미 시간을 등록했는지 확인하기 위해 쿼리 실행
// 2-a. 이미 있으면 "?시 ?분으로 알림이 설정된 상태입니다. 변경하시겠습니까 (버튼 메시지, 예/아니오)" 메시지 보내기
// 2-b. 없으면 바로 시간 입력 단계로 넘어가기
// 3. 사용자에게 입력 받기 "원하시는 시간을 24시간제로 다음과 같이 입력해주세요. (HH MM), 취소를 원하실 경우 X를 입력해주세요"
// 4. 형식이 잘못되면 오류 메시지 및 "다시 입력해주세요".
// 5. 쿼리 실행 후 등록

import { logger } from '../logger.js'
import {MongoUtil} from '../util/mongoUtil.js';
import {Message} from "discord.js";

async function getUserDailyTime(message: Message){
    try {
        const user = await MongoUtil.findUserWithDiscordId(message.author.id)

        if (!user) { //If no user is found
            await message.reply("백준 아이디를 등록하지 않았습니다. !register을 통해 아이디를 등록해주세요");
            return;
        }

        if (user['daily_time']) { //If user already set daily time
            const [hour, min] = user['daily_time'].split(' ');
            await message.reply(`${hour}시 ${min}분으로 알림이 설정된 상태입니다. 알림을 비활성화하려면 '비활성화', 변경하시려면 '변경', 명령을 취소하려면 '취소'를 입력해주세요`);

            // Filter for user response
            const responseFilter = (m: { author: { bot: any; id: string; }; content: string; }) => !m.author.bot && m.author.id === message.author.id && !m.content.startsWith('!') &&
                (m.content === '비활성화' || m.content === '변경' || m.content === '취소');
            const responseCollector = message.channel.createMessageCollector({
                filter: responseFilter,
                max: 1,
                time: 20000
            });

            // Execute functions based on user response
            responseCollector.on('collect', async msg => {
                switch (msg.content) {
                    case '변경':
                        getInputOfDailyTime(message, true);
                        break;
                    case '취소':
                        await message.reply("명령을 취소하셨습니다.")
                        break;
                    case '비활성화':
                        const result = await MongoUtil.deleteTime(message.author.id);
                        if (result) {
                            await message.reply("알림을 비활성화했습니다")
                        } else {
                            await message.reply("알 수 없는 오류가 발생했습니다.")
                        }
                        break;
                    default:
                        break;
                }
                responseCollector.stop();
            });

            responseCollector.on('end', collected => {
                //Terminate if time limit is exceeded
                if (collected.size === 0) {
                    message.channel.send("입력 시간이 만료되었습니다.");
                }
            });

        } else { //If user did not set daily time
            getInputOfDailyTime(message, false);
        }
    }catch (error){
        logger.error(error)
    }
}


function getInputOfDailyTime(message: Message, isUserDailyTimeAlreadySet: boolean) {
    message.channel.send("원하시는 시간을 24시간제로 다음과 같이 입력해주세요. (HH MM), 취소를 원하실 경우 '취소'를 입력해주세요.");

    const botFilter = (m: { author: { bot: any; id: string; }; content: string; }) => !m.author.bot && m.author.id === message.author.id && !m.content.startsWith('!');
    const idCollector = message.channel.createMessageCollector({filter: botFilter,max:1, time: 20000});

    idCollector.on('collect', async msg => {
        if (msg.content === '취소'){
            await message.reply("명령을 취소하셨습니다.")
            return;
        }

        const isDailyTimeInserted = await addDailyTimeOfUser(message.author.id, msg.content, isUserDailyTimeAlreadySet)

        switch (isDailyTimeInserted) {
            case 0: //If time is successfully inserted
                const [hour, min] = msg.content.split(' ')
                message.channel.send(`성공적으로 등록되었습니다. 설정한 시간: ${hour}시 ${min}분`)
                break;
            case -1: //If error occurred
                message.channel.send("알 수 없는 오류가 발생했습니다.")
                break;
            case -2: //If time format is invalid
                await message.reply("시간 형식이 올바르지 않습니다. 올바른 형식으로 입력해주세요. (ex. 오전 1시 1분: 01 01)")
                break;
        }

        //Terminate the collector after the user inputs the time
        idCollector.stop();
    });

    idCollector.on('end', collected => {
        //Terminate if time limit is exceeded
        if (collected.size === 0) {
            message.channel.send("입력 시간이 만료되었습니다.");
        }
    });

}

async function addDailyTimeOfUser(discordId: string, userInput: string, isDailyTimeAlreadySet: boolean) {
    const [hour, minute] = userInput.split(' ');

    // If the time format is not properly entered
    if (hour.length !== 2 || minute.length !== 2 || isNaN(Number(hour)) || isNaN(Number(minute)) ||
        parseInt(hour, 10) < 0 || parseInt(hour, 10) >= 24 || parseInt(minute, 10) < 0 ||
        parseInt(minute, 10) >= 60) {
        return -2;
    }

    const userDailyTime = `${parseInt(hour, 10)} ${parseInt(minute, 10)}`

    // Modify time if user already set daily time, add time if not
    if (!isDailyTimeAlreadySet){
        const response = await MongoUtil.addTime(discordId, userDailyTime);
        if (!response){
            return -1;
        }
    }else{
        const response = await MongoUtil.modifyTime(discordId, userDailyTime);
        if (!response){
            return -1;
        }
    }
    return 0;

}

export async function execute(message: Message) {
    await getUserDailyTime(message);
}

