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

# Copia el build estático
COPY --from=builder /app/dist /usr/share/nginx/html

# Template de Nginx -- se resuelve en runtime vía entrypoint de nginx:alpine
# (docker-entrypoint.d/20-envsubst-on-templates.sh) usando las variables
# BACKEND_HOST y BACKEND_PORT
COPY nginx.conf /etc/nginx/templates/default.conf.template

ENV BACKEND_HOST=backend \
    BACKEND_PORT=3000

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
