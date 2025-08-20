# backend/Dockerfile

# --- 1. AŞAMA: BUILDER ---
# Kodun derlendiği ve bağımlılıkların kurulduğu aşama.
FROM node:18-alpine AS builder

WORKDIR /app

# Sadece bağımlılık dosyalarını kopyala (build cache optimizasyonu için).
COPY backend/package.json backend/package-lock.json* ./

# Bağımlılıkları yükle.
# 'npm install' komutu bittiğinde package.json'daki 'postinstall' script'i
# otomatik olarak 'npx prisma generate' komutunu çalıştıracaktır.
RUN npm install

# Geri kalan tüm backend kodunu kopyala.
COPY backend/ ./

# Projeyi derle (build script'i de prisma generate içeriyor, bu bir güvencedir).
RUN npm run build


# --- 2. AŞAMA: PRODUCTION ---
# Sadece uygulamanın çalışması için gerekli minimum dosyaların alındığı aşama.
FROM node:18-alpine

WORKDIR /app

# SADECE production bağımlılıklarını kurmak için ilgili dosyaları kopyala.
COPY backend/package.json backend/package-lock.json* ./

# Production bağımlılıklarını yükle ('postinstall' burada da çalışacak).
RUN npm install --omit=dev

# Derlenmiş dosyaları 'builder' aşamasından kopyala.
COPY --from=builder /app/dist ./dist

# Prisma şemasını kopyala (runtime'da gerekli).
COPY backend/prisma ./prisma

# Uygulamanın çalışacağı port'u belirt.
EXPOSE 3000

# Uygulamayı production modunda başlat.
CMD [ "npm", "run", "start:prod" ]