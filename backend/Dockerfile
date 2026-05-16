# Build from monorepo root: docker build -f backend/Dockerfile .

# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /monorepo

COPY shared/package*.json ./shared/
COPY shared/src ./shared/src

COPY backend/package*.json ./backend/
WORKDIR /monorepo/backend
RUN npm ci

WORKDIR /monorepo
COPY backend/src ./backend/src
COPY backend/tsconfig.json ./backend/
COPY backend/nest-cli.json ./backend/

WORKDIR /monorepo/backend
RUN npm run build

# ---- Production stage ----
FROM node:20-alpine AS production
WORKDIR /monorepo

ENV NODE_ENV=production

COPY shared/package*.json ./shared/
COPY shared/src ./shared/src

COPY backend/package*.json ./backend/
WORKDIR /monorepo/backend
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /monorepo/backend/dist ./dist

EXPOSE 3001

CMD ["node", "dist/main"]
