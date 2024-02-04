import {MongoUtil} from "../util/mongoUtil.js";
import {ChatInputCommandInteraction, Message, SlashCommandBuilder} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('버그나 개선사항을 제보합니다.')
        .addStringOption(option => option.setName('content').setDescription('내용을 입력해주세요. 모든 피드백은 익명으로 개발자에게 전달됩니다.').setRequired(true)),

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const content = interaction.options.getString('content');
            const result = await MongoUtil.insertReport(content!);
            if (result) {
                await interaction.reply("정상적으로 전달되었습니다. 소중한 피드백 감사합니다.")
            } else {
                await interaction.reply("알 수 없는 오류가 발생했습니다.")
            }
        } catch (error) {
            await interaction.reply("알 수 없는 오류가 발생했습니다.")
            console.log(error)
        }
    }
}