const axios = require('axios')
const {BojProblem, getProblemErrorMsg} = require("../models/problem");
const logger = require("../logger")
const modelUtil = require("../util/model_server_api");
const discordUtil = require("../util/discord_db");


async function getRecommendedProblem(user_id) {
    let bojProblem = new BojProblem()
    try{
        const problem_arr = await modelUtil.getSinglePersonalizedProblems(user_id,1)
        if (problem_arr.length === 0){
            logger.warn(`${user_id}/ 모델 서버 오류로 인한 랜덤 문제 반환`)
            return await getRandomProblem()
        }
        const response = await axios.get('https://solved.ac/api/v3/problem/show', {
            params: {
                problemId: problem_arr[0],
            },
        });
        bojProblem.setProperties(response.data.problemId, response.data.titleKo, response.data.level, response.data.tags)
    }catch(error){
        logger.error(error)
        logger.warn(`${user_id}/ 모델 서버 오류로 인한 랜덤 문제 반환`)
        bojProblem = await getRandomProblem()
    }
    return bojProblem;
}

async function getRandomProblem(attempts = 0) {
    let bojProblem = new BojProblem()
    if (attempts >= 5) {
        logger.warn("최대 요청 횟수 (5회) 초과")
        return getProblemErrorMsg("알 수 없는 오류가 발생했습니다.")
    }
    //TODO 현재는 숫자로 범위를 지정해줬는데, 나중에 백준 사이트를 통해 직접 문제 수를 받아야 함.
    const randomId = Math.floor(Math.random() * (28415 - 1000)) + 1000;
    try {
        const response = await axios.get('https://solved.ac/api/v3/problem/show', {
            params: {
                problemId: randomId,
            },
        });
        console.log(response.data)
        bojProblem.setProperties(response.data.problemId, response.data.titleKo, response.data.level, response.data.tags)

        return bojProblem

    } catch (error) {
        //가끔 번호가 배정이 안된 경우가 있음
        logger.warn(`문제 요청 실패. 다시 요청 시도 (${attempts+1}번쨰 시도)`)
        //최대 5번 시도
        return await getRandomProblem(attempts + 1);
    }
}
module.exports = {
    name: '문제 랜덤 추천',
    async execute(message, userCommandStatus, args) {
        let conn;
        if (userCommandStatus[message.author.id]) { //해당 사용자가 이미 다른 명령어를 실행하고 있는 경우
            return;
        }

        try{
            conn = await discordUtil.getConnection()

            const existingID = await discordUtil.getBojID(conn, message.author.id)

            if (existingID.length < 1) { //없다면
                message.reply("백준 아이디를 등록하지 않았습니다. !register을 통해 아이디를 등록해주세요");
                return;
            }
            const randProblem = await getRecommendedProblem(existingID[0]['boj_id']);
            logger.info(`반환 성공 : ${message.author.id}에게 ${randProblem.problemId}번 문제 반환`)

            const randProblemMsg = randProblem.getEmbedMsg("랜덤 문제입니다.")

            message.channel.send({embeds: [randProblemMsg]})
        }catch (error){
            logger.error(error)
            message.reply("알 수 없는 오류가 발생했습니다.")
        }finally {
            conn.release()
        }

    }, getRecommendedProblem
};