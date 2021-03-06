FROM node:10-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node . .

USER node

RUN yarn install && (cd client; yarn install)
RUN yarn run build

# Could also put this stuff in docker-compose later on
ENV NODE_ENV production
ENV PORT 8080

EXPOSE 8080

CMD [ "node", "index.js" ]
