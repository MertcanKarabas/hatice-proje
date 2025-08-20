# backend/Dockerfile

# --- 1. AŞAMA: BUILDER ---
# Bu aşamada projenin bağımlılıkları kurulur ve kod derlenir (build).
FROM node:18-alpine AS builder

# Uygulama için çalışma dizini oluştur
WORKDIR /app

# ÖNCE: Sadece bağımlılık dosyalarını kopyala.
# Docker bu adımı cache'leyerek her seferinde 'npm install' yapılmasını engeller.
COPY backend/package.json backend/package-lock.json* ./

# Bağımlılıkları yükle
RUN npm install

# SONRA: Geri kalan tüm backend kodunu kopyala
COPY backend/ ./

# Prisma Client'ı oluştur
RUN npx prisma generate

# Uygulamayı production için derle
RUN npm run build


# --- 2. AŞAMA: PRODUCTION ---
# Bu aşamada sadece uygulamanın çalışması için gerekli dosyalar alınır.
# Bu sayede son image boyutu çok daha küçük olur.
FROM node:18-alpine

# Çalışma dizinini ayarla
WORKDIR /app

# SADECE production bağımlılıklarını kurmak için ilgili dosyaları kopyala
COPY backend/package.json backend/package-lock.json* ./
RUN npm install --omit=dev

# Derlenmiş dosyaları 'builder' aşamasından bu aşamaya kopyala
COPY --from=builder /app/dist ./dist

# Prisma şemasını kopyala (çalışma anında gerekli)
COPY backend/prisma ./prisma

# Uygulamanın çalışacağı port'u belirt
EXPOSE 3000

# Uygulamayı production modunda başlat
# package.json dosyanızda "start:prod": "node dist/main" script'inin olduğundan emin olun.
CMD [ "npm", "run", "start:prod" ]