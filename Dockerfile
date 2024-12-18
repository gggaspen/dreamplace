# Usa una imagen base de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos necesarios
COPY package*.json ./
COPY . .

# Instala las dependencias
RUN npm install

# Construye la app Next.js
RUN npm run build

# Expone el puerto que Railway usará
EXPOSE 8080

# Usa la salida standalone
CMD ["node", ".next/standalone/server.js"]
