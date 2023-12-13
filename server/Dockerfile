

FROM node:lts-alpine
WORKDIR /server
COPY ./package.json .
COPY . .

RUN npm install telegraf
RUN npm install multer
RUN npm install axios
RUN npm install pg
RUN npm install socket.io-client
RUN npm install express
RUN npm install cors
RUN npm install socket.io
RUN npm install nodemon
RUN npm i

EXPOSE 8081
CMD ["npm", "start"]