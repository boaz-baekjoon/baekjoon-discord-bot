const axios = require("axios")
const logger = require("../logger")
const dotenv = require("dotenv")
const {bojProblem} = require("../models/problem");

dotenv.config()
class ModelConnector {
    constructor() {}
    async getPersonalizedProblems(userId, problemNum){
        let problem_arr = [];
        const response = await axios.get(`${process.env.BASE_URL}/api/random` , {
            timeout: 3000,
            params:{
                user_id: userId,
                num: problemNum
            }
        }).then(response =>{
            problem_arr = response.data.problems;
        }).catch(error => {
            if (error.code === 'ECONNABORTED'){
                logger.error(error)
            }
        }).finally(() => {
            return problem_arr;
        })
    }
}

module.exports = { ModelConnector }