FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci || npm install

EXPOSE 3000

ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

VOLUME ["/app/node_modules"]

CMD ["npm", "run", "dev"]
