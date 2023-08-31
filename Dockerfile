FROM node:18
  
WORKDIR /app
  
COPY package*.json ./
  
RUN npm install
  
COPY . .

ENV DISCORD_TOKEN <your discord bot token>

ENV RDS_ENDPOINT <your endpoint>

ENV RDS_USER <your username>

ENV RDS_PASSWORD <your password>

ENV RDS_DB <your db name>

ENV TZ <your region timezone>
  
EXPOSE 80

CMD ["npm", "start"]
