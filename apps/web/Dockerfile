# apps/web/Dockerfile

# ---- base ----
FROM node:20-alpine AS base
RUN npm install -g pnpm

# ---- builder ----
FROM base AS builder
WORKDIR /app
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/types/package.json ./packages/types/
RUN pnpm install --frozen-lockfile

COPY apps/web ./apps/web
COPY packages/types ./packages/types
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter @repo/web build

# ---- runner ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000
CMD ["node", "apps/web/server.js"]
