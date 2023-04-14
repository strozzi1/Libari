FROM node:19.0.0-alpine3.16

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

CMD [ "npm", "start" ]