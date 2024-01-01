import {EmbedBuilder, Message} from "discord.js";

export async function execute(message: Message){
    const categoryList = new EmbedBuilder()
        .setColor(0x3498DB)
        .setAuthor({name: 'BOJ Bot'})
        .setTitle("알고리즘 분류 목록입니다.")
        .setDescription("원하시는 문제 유형을 !{숫자}로 입력해주세요!")
        .addFields(
            { name: '1: 기본 알고리즘 및 구현', value: '구현, 시뮬레이션과 같이 구현 능력을 요구하는 문제', inline: false },
            { name: '2: 자료 구조', value: '\n각종 자료구조 활용 능력을 요구하는 문제', inline: false },
            { name: '3: 동적 프로그래밍', value: '\nDP에 대해 연습할 수 있는 문제', inline: false },
            { name: '4: 그래프 이론', value: '\nDFS, BFS을 포함한 그래프와 관련된 문제', inline: false },
            { name: '5: 탐색 알고리즘', value: '\n이진 탐색, 완전 탐색과 같은 탐색에 관한 문제', inline: false },
            { name: '6: 문자열 처리', value: '\n문자열을 다루는 능력을 필요로 하는 문제.', inline: false },
            { name: '7: 수학적 알고리즘', value: '\n수학적 사고력을 요구하는 문제.', inline: false },
            { name: '8: 최적화 문제', value: '\nGreedy, Divide and Conquer 등, 다양한 최적화 기법을 사용해야 하는 문제', inline: false },
            { name: '9: 기하학적 알고리즘', value: '\n기하학과 관련된 문제', inline: false },
            { name: '10: 고급 알고리즘', value: '\n심화 알고리즘 사용을 요구하는 문제', inline: false },
            { name: '11: 기타', value: '\n그 외의 알고리즘 관련 문제로 분류된 문제', inline: false }
        )
        .setTimestamp()

    await message.channel.send({embeds: [categoryList]});

    // 사용자는 !1, !2, !3, !4, !5, !6, !7, !8, !9, !10, !11 중 하나를 입력한다.
    // !를 제외한 숫자 중, 1~11이 아닌 숫자를 입력하면 "잘못된 입력입니다. 다시 입력해주세요."를 출력한다.
    const selectedNumber = parseInt(message.content.split('!')[1]);
    const botFilter = (m: { author: { bot: any; id: string; }; content: string; }) => !m.author.bot && m.author.id === message.author.id
        && !m.content.startsWith('!') && (selectedNumber >= 1 && selectedNumber <= 11);
    const idCollector = message.channel.createMessageCollector({filter: botFilter,max:1, time: 20000});
}