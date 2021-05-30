FROM node:alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

USER node

COPY --chown=node:node . ./

CMD ["npm", "start"]
