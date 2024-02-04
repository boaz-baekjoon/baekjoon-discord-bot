import {logger} from "../logger.js";
import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {ModelUtil} from "../util/modelUtil.js";
import {categoryList} from "../embedMessage/categoryMessage.js";

export default {
    data: new SlashCommandBuilder()
        .setName('categorylist')
        .setDescription('카테고리 목록을 받습니다.'),

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            await interaction.reply({embeds: [categoryList]});
        } catch (error) {
            logger.error(error)
            await interaction.reply("알 수 없는 오류가 발생했습니다.")
        }
    }
}