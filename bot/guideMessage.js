const {EmbedBuilder} = require("discord.js");
const embedWelcome = new EmbedBuilder()
    .setColor(0x3498DB)
    .setAuthor({name: 'BOJ Bot'})
    .setTitle("안녕하세요 백준 봇입니다 :)")
    .setDescription("원하시는 서비스를 !{명령어} 형식으로 입력해주세요!")
    .addFields(
        { name: '!register', value: '백준 봇 서비스를 사용하기 위해 백준 아이디를 등록합니다.', inline: false },
        { name: '!random', value: '백준에서 랜덤하게 문제를 추천해드립니다.', inline: false },
        { name: '!streak', value: '매일 문제를 풀지 않았을 경우, 알림을 보내드립니다.', inline: false },
        { name: '!daily', value: '일일 맞춤형 문제를 추천 드립니다.', inline: false },
        { name: '!help', value: '백준 봇 명령어를 알려드립니다.', inline: false },

    )
    .setTimestamp()

module.exports = embedWelcome;