import {MongoUtil} from "../util/mongoUtil.js";
import {Message} from "discord.js";

export async function execute(message: Message) {
    try{
        message.channel.send("버그나 개선사항들을 자유롭게 입력해주세요. 모든 의견은 익명으로 개발자에게 전달됩니다.\n명령을 취소하시려면 '취소'를 입력해주세요.")
        const botFilter = (m: { author: { bot: any; id: string; }; content: string; }) => !m.author.bot && m.author.id === message.author.id && !m.content.startsWith('!');
        const responseCollector = message.channel.createMessageCollector({filter: botFilter, max: 1, time: 20000});

        responseCollector.on('collect', async msg => {
            if (msg.content === '취소'){
                await message.reply("명령을 취소하셨습니다.")
                return;
            }
            if (msg.content.length <= 0){
                await message.reply("내용을 입력해주세요. 명령을 취소합니다.")
                return;
            }

            const result = await MongoUtil.insertReport(msg.content)
            if (result){
                await message.reply("정상적으로 전달되었습니다. 소중한 피드백 감사합니다.")
            }else{
                await message.reply("알 수 없는 오류가 발생했습니다.")
            }
        })
        responseCollector.on('end', collected => {
            if (collected.size === 0){
                message.reply("입력 시간이 만료되었습니다.")
            }
        });
    }catch (error){
        await message.reply("알 수 없는 오류가 발생했습니다.")
        console.log(error)
    }

}