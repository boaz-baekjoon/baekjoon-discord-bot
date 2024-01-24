import {EmbedBuilder} from "discord.js";
export const embedWelcome = new EmbedBuilder()
    .setColor(0x3498DB)
    .setAuthor({name: 'Baekjoon Bot', iconURL: 'https://avatars.githubusercontent.com/u/139442196?s=200&v=4'})
    .setThumbnail('https://avatars.githubusercontent.com/u/139442196?s=200&v=4')
    .setTitle("안녕하세요 백준 봇입니다! :)")
    .setDescription("원하시는 서비스를 !{명령어} 형식으로 입력해주세요!")
    .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: '!register', value: '백준 봇 서비스를 사용하기 위해 백준 아이디를 등록합니다.', inline: false },
        { name: '!prob', value: '개인별 맞춤 문제를 추천해드립니다.', inline: false },
        { name: '!similarid', value: '문제 번호에 해당하는 백준 문제와 유사한 문제를 추천해드립니다.', inline: false },
        { name: '!daily', value: '일일 맞춤형 문제를 추천 드립니다.', inline: false },
        { name: '!category', value: '알고리즘 분류 목록을 보여드립니다.', inline: false },
        { name: '!help', value: '백준 봇 명령어를 알려드립니다.', inline: false },
        { name: '\u200B', value: '\u200B' }
    )
    .setTimestamp()
    .setFooter({text: 'Baekjoon Bot', iconURL: 'https://avatars.githubusercontent.com/u/139442196?s=200&v=4'})