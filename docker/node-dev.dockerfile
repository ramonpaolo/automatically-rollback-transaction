FROM node:16.20-alpine

WORKDIR /app

EXPOSE 3000

COPY ./package.json ./

RUN yarn

COPY ./ ./

CMD ["yarn", "dev"]