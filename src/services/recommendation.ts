import { BojProblem, getProblemErrorMsg } from "../models/problem.js";
import { logger } from '../logger.js';
import { ModelApi } from "./model-api.js";
import { ProblemRepository } from "./problem-repository.js";

export async function getRecommendedProblem(userId: string): Promise<BojProblem> {
    try {
        const problemArr = await ModelApi.getSingleProblem(userId, 1);
        if (problemArr.length === 0) {
            logger.warn(`${userId}/ 모델 서버 오류로 인한 랜덤 문제 반환`);
            return await getRandomProblem();
        }
        const problem = await ProblemRepository.findByProblemId(problemArr[0]);
        return problem ?? await getRandomProblem();
    } catch (error) {
        logger.error(error);
        logger.warn(`${userId}/ 모델 서버 오류로 인한 랜덤 문제 반환`);
        return await getRandomProblem();
    }
}

export async function getRandomProblem(): Promise<BojProblem> {
    for (let i = 0; i < 5; i++) {
        try {
            const randomId = Math.floor(Math.random() * (28415 - 1000)) + 1000;
            const bojProblem = await ProblemRepository.findByProblemId(randomId);
            if (bojProblem) {
                return bojProblem;
            } else {
                logger.warn(`${randomId}번은 없는 문제. 재시도 ${i + 1}`);
            }
        } catch (error) {
            logger.error(error);
        }
    }
    return getProblemErrorMsg();
}
