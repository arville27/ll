FROM node:alpine AS builder

RUN apk add --no-cache libc6-compat
RUN apk update

# Set working directory
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=@ll/server --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:alpine AS installer
RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm ci

# Build the project
COPY --from=builder /app/out/full/ .
RUN npx prisma generate --schema apps/server/prisma/schema.prisma
RUN npx turbo run build --filter=server...

FROM node:alpine AS runner
ENV DATABASE_URL=file:/app/data/app.db
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN mkdir -p /app/data && chown 1001:1001 /app -R 
USER nextjs

COPY --from=installer /app/apps/server/next.config.js .
COPY --from=installer /app/apps/server/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/server/prisma ./prisma
COPY --from=installer --chown=nextjs:nodejs /app/apps/server/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/server/.next/static ./apps/server/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/server/public ./apps/server/public

RUN npx prisma migrate deploy
CMD node apps/server/server.js