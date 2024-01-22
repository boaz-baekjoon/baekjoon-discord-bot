import axios from 'axios'
import { logger } from '../logger.js'
import * as dotenv from 'dotenv'

dotenv.config()

export class ModelUtil {
    static async getSingleProblem(userId: string, numberOfProblems: number){
        try {
            const response = await axios.post(`${process.env.BASE_URL}/baekjun/user_id` , {
                    user_id_list: [userId],
                    problem_num: numberOfProblems
                },
                {
                timeout: 3000
            });
            if (Array.isArray(response.data[userId])) {
                return response.data[userId];
            }
        } catch(error: any) {
            logger.error(error.message)
        }
        return [];
    }

    static async getSimilarProbWithId(probId: number){
            let problem_arr = []
            try{
                const response = await axios.post(`${process.env.BASE_URL}/baekjun/similar_id` , {
                        problem_id: probId,
                        problem_num: 1
                    },
                    {
                        timeout: 3000
                });
                logger.verbose(response.data[`${probId}`]);
                if (response.data[`${probId}`] !== undefined && Array.isArray(response.data[`${probId}`])) {
                    problem_arr = response.data[`${probId}`];
                }else{
                    return [];
                }
            }catch(error: any){
                logger.error(error.message)
            }
            return problem_arr;
        }

    static async getProblemWithCategory(userId: string, categoryId: number){
        let problem_arr = []
        try{
            const response = await axios.post(`${process.env.BASE_URL}/baekjun/category` , {
                    user_id: userId,
                    category: categoryId,
                    problem_num: 1
                },
                {
                    timeout: 3000
                });
            if (Array.isArray(response.data[userId])) {
                problem_arr = response.data[userId];
            }
        }catch(error: any){
            logger.error(error.message)
        }
        return problem_arr;
    }
}



