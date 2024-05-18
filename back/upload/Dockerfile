FROM node:20.11.1-alpine as builder

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY . /app
RUN npm install
RUN npm run build

EXPOSE 3001

CMD [ "node", "youtube.js" ]
