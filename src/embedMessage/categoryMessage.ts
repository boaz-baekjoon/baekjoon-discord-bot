import {EmbedBuilder} from "discord.js";

export const categoryList = new EmbedBuilder()
    .setColor(0x3498DB)
    .setAuthor({name: 'Baekjoon Bot', iconURL: 'https://avatars.githubusercontent.com/u/139442196?s=200&v=4'})
    .setThumbnail('https://avatars.githubusercontent.com/u/139442196?s=200&v=4')
    .setTitle("알고리즘 분류 목록입니다.")
    .setDescription("원하시는 문제 유형을 숫자로 입력해주세요! (ex. DP의 경우 2)")
    .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: '0: 기본 알고리즘 및 구현', value: 'implementation, simulation, arithmetic', inline: true },
        { name: '1: 자료 구조', value: 'data_structure, deque, stack', inline: true },
        { name: '2: 동적 프로그래밍', value: 'dp, dp_bitfield, deque', inline: true },
        { name: '\u200B', value: '\u200B' },
        { name: '3: 그래프 이론', value: 'bfs, dfs, mst, graphs', inline: true },
        { name: '4: 탐색 알고리즘', value: 'binary_search, bruteforcing, backtracking', inline: true },
        { name: '5: 문자열 처리', value: 'regex, string, suffix_tree', inline: true },
        { name: '\u200B', value: '\u200B' },
        { name: '6 수학적 알고리즘', value: 'math, calculus, probability', inline: true },
        { name: '7: 최적화 문제', value: 'greedy, divide_and_conquer', inline: true },
        { name: '8: 기하학적 알고리즘', value: 'geometry, parsing, sweeping', inline: true },
        { name: '\u200B', value: '\u200B' },
        { name: '9: 고급 알고리즘', value: 'green, utf8, bayes, hackenbush', inline: false },
        { name: '\u200B', value: '\u200B' },
)
    .setTimestamp()
    .setFooter({text: 'Baekjoon Bot', iconURL: 'https://avatars.githubusercontent.com/u/139442196?s=200&v=4'})