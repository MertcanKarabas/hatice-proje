# backend/Dockerfile

# --- 1. AŞAMA: BUILDER ---
# Bu aşamada projenin bağımlılıkları kurulur ve kod derlenir.
FROM node:18-alpine

WORKDIR /usr/src/app

COPY backend/package*.json ./
ENV NODE_ENV=development

RUN npm install
RUN npm install -g @nestjs/cli

COPY backend/ ./
RUN npx prisma generate


# Uygulamayı production için derle.
RUN npm run build

CMD [ "npm", "run", "start:dev" ]