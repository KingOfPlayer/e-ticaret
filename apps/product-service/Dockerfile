FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm and turbo
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN npm install -g turbo

# Copy workspace configuration
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./

# Copy packages and the specific app
COPY packages/ ./packages/
COPY apps/product-service/ ./apps/product-service/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the app using turbo
RUN turbo build --filter=product-service

# Production phase
FROM node:22-alpine AS runner
WORKDIR /app

COPY --from=builder /app/apps/product-service/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/product-service/package.json ./

EXPOSE 5002
CMD ["node", "dist/main"]
