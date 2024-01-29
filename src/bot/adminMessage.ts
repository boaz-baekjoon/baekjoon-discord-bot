import {Client, Message} from "discord.js";
import {MongoUtil} from "../util/mongoUtil.js";
import {getRecommendedProblem} from "../commands/prob.js";
import {logger} from "../logger.js";

export async function sendAdminMessage(message: Message, client: Client) {
    message.channel.send("공지사항을 입력해주세요.");
    const botFilter = (m: { author: { bot: any; id: any; }; content: string; }) => !m.author.bot && m.author.id === message.author.id && !m.content.startsWith('!');
    const responseCollector = message.channel.createMessageCollector({ filter: botFilter, max: 1, time: 20000 });

    responseCollector.on('collect', async msg => {
        const users = await MongoUtil.findAllUser();
        for (let user of users) {
            try{
                const targetUser = await client.users.fetch(user.discord_id)
                await targetUser.send(msg.content);
            }catch (error){
                logger.error(error);
            }
        }
    });
    responseCollector.on('end', collected => {
        if (collected.size === 0) {
            message.reply("입력 시간이 만료되었습니다.")
        }
    });

}