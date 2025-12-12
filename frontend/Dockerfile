FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Kita menggunakan mode preview/dev agar ringan untuk tugas
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host"]