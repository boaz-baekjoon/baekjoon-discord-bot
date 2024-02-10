import {ChatInputCommandInteraction, Client, Message, SlashCommandBuilder} from "discord.js";
import {MongoUtil} from "../util/mongoUtil.js";
import {getRecommendedProblem} from "./prob.js";
import {logger} from "../logger.js";

export default{
    data: new SlashCommandBuilder()
        .setName('adminmessage')
        .setDescription('ADMIN COMMAND')
        .addStringOption(option => option.setName('message').setDescription('공지사항을 입력해주세요.').setRequired(true)),

    async execute(interaction: ChatInputCommandInteraction){
        if(interaction.user.id !== process.env.ADMIN_ID){
            await interaction.reply("권한이 없습니다.")
            return;
        }else{
            await interaction.reply("메시지를 전송합니다.")
            const users = await MongoUtil.findAllUser();
            for (let user of users) {
                try{
                    const targetUser = await interaction.client.users.fetch(user.discord_id);
                    await targetUser.send(interaction.options.getString('message')!);
                }catch (error){
                    logger.error(error);
                }
            }
        }
    }
}