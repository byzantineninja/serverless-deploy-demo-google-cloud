# apps/api/Dockerfile

# ---- base ----
FROM node:20-alpine AS base
RUN npm install -g pnpm

# ---- builder ----
FROM base AS builder
WORKDIR /app
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/
RUN pnpm install --frozen-lockfile

COPY apps/api ./apps/api
COPY packages/types ./packages/types
RUN pnpm --filter @repo/api build
RUN pnpm --filter @repo/api deploy --prod /app/deploy

# ---- runner ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/deploy/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./dist

EXPOSE 8080
CMD ["node", "dist/main"]
