# backend/Dockerfile

# --- 1. AŞAMA: BUILDER ---
# Bu aşamada projenin bağımlılıkları kurulur ve kod derlenir.
FROM node:18-alpine AS builder

WORKDIR /app

# ÖNCE: Sadece bağımlılık dosyalarını kopyala (daha hızlı build için).
COPY backend/package.json backend/package-lock.json* ./
RUN npm install

# SONRA: Geri kalan tüm backend kodunu kopyala.
COPY backend/ ./

# Prisma Client'ı oluştur. Bu adımın çalışması için Render'da DATABASE_URL'in tanımlı olması gerekir.
RUN npx prisma generate

# Uygulamayı production için derle.
RUN npm run build


# --- 2. AŞAMA: PRODUCTION ---
# Bu aşamada sadece uygulamanın çalışması için gerekli minimum dosyalar alınır.
FROM node:18-alpine

WORKDIR /app

# SADECE production bağımlılıklarını kurmak için ilgili dosyaları kopyala.
COPY backend/package.json backend/package-lock.json* ./
RUN npm install --omit=dev

# Derlenmiş dosyaları 'builder' aşamasından bu aşamaya kopyala.
COPY --from=builder /app/dist ./dist

# Üretilen Prisma Client'ı 'builder' aşamasından kopyala. BU ÖNEMLİ!
# Bu sayede runtime'da 'prisma generate' çalıştırmaya gerek kalmaz.
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Prisma şemasını kopyala (çalışma anında bazı durumlar için gerekli olabilir).
COPY backend/prisma ./prisma

# Uygulamanın çalışacağı port'u belirt.
EXPOSE 3000

# Uygulamayı production modunda başlat.
# package.json dosyanızda "start:prod": "node dist/main" script'inin olduğundan emin olun.
CMD [ "npm", "run", "start:prod" ]