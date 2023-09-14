# Baekjoon-Bot
<img width="717" alt="스크린샷 2023-08-01 오후 10 52 22" src="https://github.com/synoti21/BOJ-Bot/assets/58936172/12b05920-b39d-423a-9020-d0b440a9982e">

A discord bot for baekjoon users to improve PS skill
- Personalized Recommendation of BOJ problems by analyzing PS skiils in Baekjoon
- Daily notification with a single personalized BOJ problem
- Improve your weakness by recommending problems
- Register BOJ ID for getting recommendation

## 🚀 Getting Started
### 🤖 Adding the bot to your server
Click the link below and grant permissions for the bot to join your server (require additional server to add bot):

[Add bot to your server](https://discord.com/api/oauth2/authorize?client_id=1133277476869640212&permissions=18432&scope=bot)


### 💻 Running the server locally
Clone this repository and run:
```
git clone https://github.com/boaz-baekjoon/baekjoon-discord-bot.git
npm install
```
- Make your application in the discord developer site
- Create .env and fill the value with your discord bot token, and AWS RDS info
```
DISCORD_TOKEN=
RDS_ENDPOINT=
RDS_USER=
RDS_PASSWORD=
RDS_DB=
```
- Type `npm test` to test the connection with your RDS
- Type `npm start` to start the bot


### 📦 Using Docker
For those who prefer using Docker container, follow the instruction:
- Fill the environment variable in the Dockerfile
```
ENV DISCORD_TOKEN <your discord bot token>

ENV RDS_ENDPOINT <your endpoint>

ENV RDS_USER <your username>

ENV RDS_PASSWORD <your password>

ENV RDS_DB <your db name>

ENV TZ <your region timezone> # Should not delete this line when using .env instead
```
- Or, remove the commands above in Dockerfile and just create .env

- Build an image and run a container
```
docker build -t <image name> .
docker run -d <image name>
```

