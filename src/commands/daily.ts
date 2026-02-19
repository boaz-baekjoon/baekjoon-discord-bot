import { logger } from '../logger.js';
import { UserRepository } from '../services/user-repository.js';
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import type { BotCommand } from "../types.js";

export default {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('일일 문제를 받을 시간을 정합니다.')
        .addStringOption(option => option.setName('time').setDescription('일일 문제를 받을 시간을 입력해주세요. (HH MM, 예시: 13시 5분 => 13 05').setRequired(true)),

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            const time = interaction.options.getString('time', true);
            const parts = time.split(' ');
            if (parts.length !== 2) {
                await interaction.reply("시간 형식이 올바르지 않습니다. 올바른 형식으로 입력해주세요. (ex. 오전 1시 1분: 01 01)");
                return;
            }
            const [hour, min] = parts;
            if (hour.length !== 2 || min.length !== 2 || isNaN(Number(hour)) || isNaN(Number(min)) ||
                parseInt(hour, 10) < 0 || parseInt(hour, 10) >= 24 || parseInt(min, 10) < 0 ||
                parseInt(min, 10) >= 60) {
                await interaction.reply("시간 형식이 올바르지 않습니다. 올바른 형식으로 입력해주세요. (ex. 오전 1시 1분: 01 01)");
                return;
            }

            const userDailyTime = `${parseInt(hour, 10)} ${parseInt(min, 10)}`;

            const user = await UserRepository.findByDiscordId(interaction.user.id);
            if (!user) {
                await interaction.reply("백준 아이디를 등록하지 않았습니다. /register을 통해 아이디를 등록해주세요");
                return;
            }
            const response = await UserRepository.addTime(interaction.user.id, userDailyTime);
            if (!response) {
                await interaction.reply("알 수 없는 오류가 발생했습니다.");
                return;
            }
            await interaction.reply(`성공적으로 등록되었습니다. 설정한 시간: ${hour}시 ${min}분`);
        } catch (error) {
            logger.error(error);
            await interaction.reply("알 수 없는 오류가 발생했습니다.");
        }
    }
} satisfies BotCommand;
