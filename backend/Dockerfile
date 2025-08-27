FROM node:20-alpine

WORKDIR /usr/src/app

# copy package files
COPY package*.json ./
ENV NODE_ENV=development

# copy prisma BEFORE npm install (postinstall uses it)
COPY prisma ./prisma

# install deps (runs postinstall -> prisma:generate)
RUN npm install
RUN npm install -g @nestjs/cli

# copy the rest
COPY . .

EXPOSE 3000
CMD ["npm", "run", "start:dev"]
