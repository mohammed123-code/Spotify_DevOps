FROM node:20-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm config set strict-ssl false && npm install --omit=dev --legacy-peer-deps

COPY . .

ENV NODE_ENV=production

EXPOSE 5000

CMD ["node", "server.js"]