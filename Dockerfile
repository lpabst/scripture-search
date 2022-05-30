FROM node:latest as base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8012

FROM base as dev
CMD ["npm", "run", "start:dev"]

FROM base as prod
RUN npm run build
CMD ["node", "build/index.js"]