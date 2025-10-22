FROM node:18-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# El bot no necesita exponer puertos (no es servidor web)

# Comando para iniciar
CMD ["npm", "start"]
