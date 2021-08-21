FROM node:14.4.0

RUN npm install -g npm@7.20.5
RUN npm install -g pm2
RUN npm i -g @nestjs/cli
COPY package*.json /
RUN npm install --save-dev

COPY . /
RUN npm run build

ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /
RUN chmod +x /wait-for-it.sh
