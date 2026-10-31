# --- Этап 1: сборка ---
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
# Кэш npm переживает пересборки, а повторы спасают от сетевых сбоев
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund --fetch-retries=5 --fetch-retry-mintimeout=20000

COPY . .
RUN npm run build

# --- Этап 2: раздача статики ---
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
