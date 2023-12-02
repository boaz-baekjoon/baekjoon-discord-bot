import axios from 'axios'
import { logger } from '../logger'
import * as dotenv from 'dotenv'

dotenv.config()

export class ModelConnector{
    static async getSinglePersonalizedProblems(userId, problemNum){
        let problem_arr = [];
        try {
            const response = await axios.post(`${process.env.BASE_URL}/baekjun/user_id` , {
                    user_id_list: [userId],
                    problem_num: problemNum
                },
                {
                    timeout: 3000
                });
            if (Array.isArray(response.data[userId])) {
                problem_arr = response.data[userId];
            }
        } catch(error) {
            logger.error(error.message)
        }
        return problem_arr;
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



