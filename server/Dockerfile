# Sử dụng Node.js chính thức
FROM node:22-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json trước để cache
COPY package.json package-lock.json ./

# Cài đặt dependencies trước khi thêm source code
RUN npm ci  # Dùng `npm ci` để đảm bảo phiên bản dependencies đúng với `package-lock.json`

# Sao chép toàn bộ mã nguồn, trừ `node_modules` (nhờ `.dockerignore`)
COPY . .

# Mở port cho NestJS
EXPOSE 4000

# Chạy ứng dụng
CMD ["npm", "run", "start:dev"]
