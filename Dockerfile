FROM node:18 as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN tsc

FROM node:18

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

CMD ["npm", "start"]
