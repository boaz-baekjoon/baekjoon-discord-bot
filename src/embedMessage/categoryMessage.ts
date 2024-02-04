import {EmbedBuilder} from "discord.js";

export const categoryList = new EmbedBuilder()
    .setColor(0x3498DB)
    .setAuthor({name: 'Baekjoon Bot', iconURL: 'https://avatars.githubusercontent.com/u/139442196?s=200&v=4'})
    .setThumbnail('https://avatars.githubusercontent.com/u/139442196?s=200&v=4')
    .setTitle("알고리즘 분류 목록입니다.")
    .setDescription("원하시는 문제 유형을 /category {숫자}로 입력해주세요!")
    .addFields(
        { name: '0: 기본 알고리즘 및 구현', value: ' ', inline: false },
        { name: '1: 자료 구조', value: ' ', inline: false },
        { name: '2: 동적 프로그래밍', value: ' ', inline: false },
        { name: '3: 그래프 이론', value: ' ', inline: false },
        { name: '4: 탐색 알고리즘', value: ' ', inline: false},
        { name: '5: 문자열 처리', value: ' ', inline: false },
        { name: '6 수학적 알고리즘', value: ' ', inline: false },
        { name: '7: 최적화 문제', value: ' ', inline: false },
        { name: '8: 기하학적 알고리즘', value: ' ', inline: false },
        { name: '9: 고급 알고리즘', value: ' ', inline: false },
)
    .setTimestamp()
    .setFooter({text: 'Baekjoon Bot', iconURL: 'https://avatars.githubusercontent.com/u/139442196?s=200&v=4'})