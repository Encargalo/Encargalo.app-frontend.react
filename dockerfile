# Etapa 1: Build
FROM node:20 AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Generar la build de producción
RUN npm run build


# Etapa 2: Servidor
FROM node:20 AS runner

# Instalar un servidor estático ligero
RUN npm install -g serve

WORKDIR /app

# Copiar solo la carpeta de build desde la etapa anterior
COPY --from=builder /app/dist ./dist

# Exponer el puerto donde correrá el contenedor
EXPOSE 3000

# Comando por defecto para servir la app
CMD ["serve", "-s", "dist", "-l", "3000"]
