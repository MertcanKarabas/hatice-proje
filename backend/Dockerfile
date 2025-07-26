# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# ÖNCE SADECE package.json dosyalarını kopyala
# Bu sayede her kod değişikliğinde npm install tekrar çalışmaz
COPY backend/package*.json ./
ENV NODE_ENV=development
# Install app dependencies
RUN npm install
RUN npm install -g @nestjs/cli
# Bundle app source
# Ardından projenin geri kalanını kopyala
COPY backend/ ./

# Generate Prisma Client
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Start command
CMD [ "npm", "run", "start:dev" ]