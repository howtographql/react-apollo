FROM node:11.9.0-alpine
WORKDIR /priceguide
COPY ./package.json .
COPY ./yarn.lock .
RUN yarn install --no-progress
COPY ./build ./build
COPY ./src/server.js ./server.js
COPY ./public ./public
USER node
CMD node server.js

EXPOSE 3000

