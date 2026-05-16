# Build from monorepo root: docker build -f frontend/Dockerfile .

# ---- Build stage ----
FROM node:24-alpine AS builder
WORKDIR /app

COPY shared/ ./shared/

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .

ARG VITE_WS_URL=http://localhost:3001
ENV VITE_WS_URL=${VITE_WS_URL}

RUN npm run build

# ---- Production stage ----
FROM nginx:alpine AS production
COPY --from=builder /app/frontend/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=10s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:80 || exit 1
CMD ["nginx", "-g", "daemon off;"]
