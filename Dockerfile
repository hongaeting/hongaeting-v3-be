FROM node:14.4.0

ARG NODE_ENV
ARG SSL_DIR
ARG SSL_KEY
ARG SSL_CERT
ARG SSL_CHAIN

RUN npm install -g npm@7.20.5
RUN npm install -g pm2
COPY package*.json /
RUN npm install --save-dev

COPY . /
ENV NODE_ENV=$NODE_ENV
RUN npm run build

RUN mkdir secrets
COPY $SSL_DIR/$SSL_KEY /secrets
COPY $SSL_DIR/$SSL_CERT /secrets
COPY $SSL_DIR/$SSL_CHAIN /secrets

ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /
RUN chmod +x /wait-for-it.sh
