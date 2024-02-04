import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {MongoUtil} from "../util/mongoUtil.js";
import {logger} from "../logger.js";

export default {
    data: new SlashCommandBuilder()
        .setName('deactivate')
        .setDescription('일일 문제 알림 수신을 비활성화 합니다.'),
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const user = await MongoUtil.findUserWithDiscordId(interaction.user.id);
            if (!user) {
                await interaction.reply("등록되지 않은 유저입니다. /register를 통해 등록해주세요.")
                return;
            }

            const response = await MongoUtil.deleteTime(interaction.user.id);
            if (response) {
                await interaction.reply("정상적으로 중단되었습니다.")
            }
            return;
        } catch (error: any) {
            await interaction.reply("알 수 없는 오류가 발생했습니다.")
            logger.error(error.message)
        }
    }
}