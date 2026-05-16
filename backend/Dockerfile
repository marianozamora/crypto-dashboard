# Build from monorepo root: docker build -f backend/Dockerfile .

# ---- Build stage ----
FROM node:24-alpine AS builder
WORKDIR /monorepo

COPY shared/package*.json ./shared/
COPY shared/tsconfig.json ./shared/
COPY shared/src ./shared/src

COPY backend/package*.json ./backend/
WORKDIR /monorepo/backend
RUN npm ci

WORKDIR /monorepo/shared
RUN ../backend/node_modules/.bin/tsc --project tsconfig.json

WORKDIR /monorepo
COPY backend/src ./backend/src
COPY backend/tsconfig.json ./backend/
COPY backend/nest-cli.json ./backend/

WORKDIR /monorepo/backend
RUN npm run build

# ---- Production stage ----
FROM node:24-alpine AS production
WORKDIR /monorepo

ENV NODE_ENV=production

COPY shared/package*.json ./shared/
COPY --from=builder /monorepo/shared/dist ./shared/dist

COPY backend/package*.json ./backend/
WORKDIR /monorepo/backend
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /monorepo/backend/dist ./dist

EXPOSE 3001

HEALTHCHECK --interval=10s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:3001/health || exit 1

CMD ["node", "dist/main"]
