# --- 1. Aşama: Build ---
# Projeyi build etmek için Node.js'in LTS (Long Term Support) sürümünü kullanıyoruz.
FROM node:20-alpine as builder

# Uygulama dosyalarının bulunacağı dizini ayarlıyoruz.
WORKDIR /usr/src/app

# Bağımlılıkları yüklemek için package.json ve package-lock.json dosyalarını kopyalıyoruz.
COPY package*.json ./
RUN npm install

# Proje kaynak kodunun tamamını kopyalıyoruz.
COPY . .

# Vite ile production build'i alıyoruz.
RUN npm run build

# --- 2. Aşama: Production ---
# Web sunucusu olarak hafif bir Nginx imajı kullanıyoruz.
FROM nginx:stable-alpine

# Build aşamasında oluşturulan statik dosyaları Nginx'in sunum yapacağı dizine kopyalıyoruz.
# Vite build çıktısını 'dist' klasörüne yazar, bu dosyaları Nginx'in html dizinine taşıyoruz.
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# İmaj dışarıya 80 portunu açacak şekilde ayarlanıyor.
EXPOSE 80

# Nginx'i başlatmak için varsayılan komut.
CMD ["nginx", "-g", "daemon off;"]