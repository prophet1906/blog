FROM node:alpine

ENV CI=true

WORKDIR /app
COPY . .
RUN yarn install

CMD ["yarn", "start"]
