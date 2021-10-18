FROM node:alpine

WORKDIR /api
COPY package.json ./
RUN npm install

USER node

COPY --chown=node:node . ./

EXPOSE 3001
CMD ["npm", "start"]
