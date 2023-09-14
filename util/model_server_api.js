const axios = require("axios")
const logger = require("../logger")
const dotenv = require("dotenv")

dotenv.config()
async function getPersonalizedProblems(userId, problemNum){
    let problem_arr = [];
    try {
        const response = await axios.get(`${process.env.BASE_URL}/api/random` , {
            timeout: 3000,
            params:{
                user_id: userId,
                num: problemNum
            }
        });
        problem_arr = JSON.parse(response["data"])["problems"];
    } catch(error) {
        if (error.code === 'ECONNABORTED'){
            logger.error(error);
        }
    }
    return problem_arr;
}


module.exports = { getPersonalizedProblems }