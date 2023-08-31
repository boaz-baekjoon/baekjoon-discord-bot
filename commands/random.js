const {EmbedBuilder} = require('discord.js')
const axios = require('axios')
const {bojProblem} = require("../models/problem");
const logger = require("../logger")

async function getRandomProblem(attempts = 0) {
    if (attempts >= 5) {
        logger.warn("최대 요청 횟수 (5회) 초과")
        return new bojProblem(-1, "알 수 없는 오류가 발생했습니다.", 0, [])
    }
    //TODO 현재는 숫자로 범위를 지정해줬는데, 나중에 백준 사이트를 통해 직접 문제 수를 받아야 함.
    const randomId = Math.floor(Math.random() * (28415 - 1000)) + 1000;
    try {
        const response = await axios.get('https://solved.ac/api/v3/problem/show', {
            params: {
                problemId: randomId,
            },
        });
        return new bojProblem(response.data.problemId, response.data.titleKo, response.data.level, response.data.tags);

    } catch (error) {
        //가끔 번호가 배정이 안된 경우가 있음
        logger.error(`문제 요청 실패. 다시 요청 시도 (${attempts+1}번쨰 시도)`)
        //최대 5번 시도
        return await getRandomProblem(attempts + 1);
    }
}


module.exports = {
    name: '문제 랜덤 추천',
    async execute(message, userCommandStatus, args) {
        const randProblem = await getRandomProblem();
        logger.info(`반환 성공 : ${message.author.id}에게 ${randProblem.problemId}번 문제 반환`)

        const randProblemMsg = randProblem.getEmbedMsg("랜덤 문제입니다.")

        message.channel.send({embeds: [randProblemMsg]})
    }, getRandomProblem
};