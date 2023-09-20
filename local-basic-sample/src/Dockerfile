FROM node:18.18.0-alpine as builder
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install


FROM node:18.18.0-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app ./
COPY . .
EXPOSE 8080
CMD [ "node", "server.js" ]
