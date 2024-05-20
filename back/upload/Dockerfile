FROM node:20.11.1-alpine as builder

WORKDIR /app_node
ENV PATH /app_node/node_modules/.bin:$PATH

COPY . /app_node
RUN npm install
RUN npm run build

EXPOSE 3001

CMD ["node", "youtube.js" ]
