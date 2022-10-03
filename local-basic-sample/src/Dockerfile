FROM node:16.17.1-alpine as builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install


FROM node:16.17.1-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app ./
COPY . .
EXPOSE 8080
CMD [ "node", "server.js" ]
