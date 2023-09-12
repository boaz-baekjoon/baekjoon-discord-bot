const axios = require("axios")
const logger = require("../logger")
const dotenv = require("dotenv")
const {BojProblem} = require("../models/problem");

dotenv.config()
async function getPersonalizedProblems(userId, problemNum){
    let problem_arr = [];
    const response = await axios.get(`${process.env.BASE_URL}/api/random` , {
        timeout: 3000,
        params:{
            user_id: userId,
            num: problemNum
        }
    }).then(res =>{
        console.log(res)
        problem_arr = res.data[problems];
    }).catch(error => {
        if (error.code === 'ECONNABORTED'){
            logger.error(error)
        }
    }).finally(() => {
        return problem_arr;
    })
}


module.exports = { getPersonalizedProblems }