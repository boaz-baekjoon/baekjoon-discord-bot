import {
    SecretsManagerClient,
    GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";


const secret_name = "boj-bot/key";

const client = new SecretsManagerClient({
    region: "ap-northeast-2",
});

let response;

try {
    response = await client.send(
        new GetSecretValueCommand({
            SecretId: secret_name,
            VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
        })
    );
} catch (error) {
    console.log(error)
}

const secret = response.SecretString;



// Your code goes here