FROM node:12
LABEL maintainer="plpllp0206@gmail.com"

WORKDIR /IMDB
COPY package*.json /IMDB/
RUN npm install
COPY . /IMDB

EXPOSE 3004

CMD [ "npm", "start" ]