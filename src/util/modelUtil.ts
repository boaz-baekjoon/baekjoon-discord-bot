import axios from 'axios'
import { logger } from '../logger'
import * as dotenv from 'dotenv'

dotenv.config()

export class modelUtil{
    static async getSingleProblem(userId, numberOfProblems){
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
        } catch(error) {
            logger.error(error.message)
        }
        return [];
    }

static async getSimilarProbWithId(probId){
        let problem_arr = []
        try{
            const response = await axios.get(`${process.env.BASE_URL}/baekjun/similar_id` , {
                timeout: 3000,
                params:{
                    problem_id: probId,
                }
            });
            if (Array.isArray(response.data['problems'])) {
                problem_arr = response.data['problems'];
            }
        }catch(error){
            logger.error(error.message)
        }
        return problem_arr;
    }

    static async getSimilarProbWithContext(probContext){
        let problem_arr= []
        try{
            const response = await axios.get(`${process.env.BASE_URL}/baekjun/similar_text` , {
                timeout: 3000,
                params:{
                    problem_text: probContext,
                }
            });
            if (Array.isArray(response.data['problems'])) {
                problem_arr = response.data['problems'];
            }
        }catch(error){
            logger.error(error.message)
        }
        return problem_arr;
    }
}



