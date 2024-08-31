FROM node:18.12.1

RUN mkdir /app

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "src/index.js"]
