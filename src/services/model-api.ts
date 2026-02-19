import axios from 'axios';
import { logger } from '../logger.js';

export class ModelApi {
    static async getSingleProblem(userId: string, numberOfProblems: number): Promise<number[]> {
        try {
            const response = await axios.post(`${process.env.BASE_URL}/baekjun/user_id`, {
                user_id_list: [userId],
                problem_num: numberOfProblems
            }, {
                timeout: 3000
            });
            if (Array.isArray(response.data[userId])) {
                return response.data[userId] as number[];
            }
        } catch (error: unknown) {
            logger.error(error instanceof Error ? error.message : error);
        }
        return [];
    }

    static async getSimilarProbWithId(probId: number): Promise<number[]> {
        try {
            const response = await axios.post(`${process.env.BASE_URL}/baekjun/similar_id`, {
                problem_id: probId,
                problem_num: 1
            }, {
                timeout: 3000
            });
            const key = String(probId);
            logger.verbose(response.data[key]);
            if (response.data[key] !== undefined && Array.isArray(response.data[key])) {
                return response.data[key] as number[];
            }
            return [];
        } catch (error: unknown) {
            logger.error(error instanceof Error ? error.message : error);
            return [];
        }
    }

    static async getProblemWithCategory(userId: string, categoryId: number): Promise<number[]> {
        try {
            const response = await axios.post(`${process.env.BASE_URL}/baekjun/category`, {
                user_id: userId,
                category: categoryId,
                problem_num: 1
            }, {
                timeout: 3000
            });
            if (Array.isArray(response.data[userId])) {
                return response.data[userId] as number[];
            }
        } catch (error: unknown) {
            logger.error(error instanceof Error ? error.message : error);
        }
        return [];
    }
}
