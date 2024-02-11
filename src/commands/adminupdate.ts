import {ChatInputCommandInteraction, Client, Message, SlashCommandBuilder} from "discord.js";
import {MongoUtil} from "../util/mongoUtil.js";
import {getRecommendedProblem} from "./prob.js";
import {logger} from "../logger.js";
import * as fs from "fs";

export default{
    data: new SlashCommandBuilder()
        .setName('adminupdate')
        .setDescription('ADMIN UPDATE LOG COMMAND'),

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            if (interaction.user.id !== process.env.ADMIN_ID) {
                await interaction.reply("권한이 없습니다.")
                return;
            } else {
                const updateLog: string = fs.readFileSync('./src/assets/updatelog.txt', 'utf8');
                console.log(updateLog);
                await interaction.reply("업데이트 사항을 전송합니다.")
                await interaction.followUp(updateLog);
                const users = await MongoUtil.findAllUser();
                for (let user of users) {
                    try{
                        const targetUser = await interaction.client.users.fetch(user.discord_id);
                        await targetUser.send(updateLog);
                    }catch (error){
                        logger.error(error);
                    }
                }
            }
        } catch (error) {
            logger.error(error);
        }
    }
}