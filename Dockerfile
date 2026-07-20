# ─── Stage 1: Build con Vite ─────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# VITE_API_URL relativa para que funcione con el proxy de Nginx
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ─── Stage 2: Servir con Nginx (imagen mínima) ───────────────────────────────
FROM nginx:alpine

# Backend hostname para el proxy (default para docker-compose local)
ARG BACKEND_HOST=backend
ENV BACKEND_HOST=$BACKEND_HOST

# Copia el build estático
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia y reemplaza placeholder en la config de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf.template
RUN envsubst '${BACKEND_HOST}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
