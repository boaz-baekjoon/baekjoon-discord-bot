// 사용자가 !daily를 하면 다음과 같이 작동
// 1. 먼저 사용자가 이미 시간을 등록했는지 확인하기 위해 쿼리 실행
// 2-a. 이미 있으면 "?시 ?분으로 알림이 설정된 상태입니다. 변경하시겠습니까 (버튼 메시지, 예/아니오)" 메시지 보내기
// 2-b. 없으면 바로 시간 입력 단계로 넘어가기
// 3. 사용자에게 입력 받기 "원하시는 시간을 24시간제로 다음과 같이 입력해주세요. (HH MM), 취소를 원하실 경우 X를 입력해주세요"
// 4. 형식이 잘못되면 오류 메시지 및 "다시 입력해주세요".
// 5. 쿼리 실행 후 등록

import { logger } from '../logger.js'
import {MongoUtil} from '../util/mongoUtil.js';
import {ChatInputCommandInteraction, Message, SlashCommandBuilder} from "discord.js";

export default{
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('일일 문제를 받을 시간을 정합니다.')
        .addStringOption(option => option.setName('time').setDescription('일일 문제를 받을 시간을 입력해주세요.').setRequired(true)),

    async execute(interaction: ChatInputCommandInteraction){
        try{
            const time = interaction.options.getString('time');
            if (time === null){
                await interaction.reply("시간을 입력해주세요.")
                return;
            }
            const [hour, min] = time.split(' ');
            if (hour.length !== 2 || min.length !== 2 || isNaN(Number(hour)) || isNaN(Number(min)) ||
                parseInt(hour, 10) < 0 || parseInt(hour, 10) >= 24 || parseInt(min, 10) < 0 ||
                parseInt(min, 10) >= 60) {
                await interaction.reply("시간 형식이 올바르지 않습니다. 올바른 형식으로 입력해주세요. (ex. 오전 1시 1분: 01 01)")
                return;
            }

            const userDailyTime = `${parseInt(hour, 10)} ${parseInt(min, 10)}`

            const response = await MongoUtil.addTime(interaction.user.id, userDailyTime);
            if (!response){
                await interaction.reply("알 수 없는 오류가 발생했습니다.")
                return;
            }
            await interaction.reply(`성공적으로 등록되었습니다. 설정한 시간: ${hour}시 ${min}분`)
        }catch (error){
            logger.error(error);
            await interaction.reply("알 수 없는 오류가 발생했습니다.")
        }
    }
}

