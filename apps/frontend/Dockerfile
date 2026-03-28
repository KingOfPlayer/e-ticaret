FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm and turbo
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN npm install -g turbo

# Copy workspace configuration
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./

# Copy packages and the frontend app
COPY packages/ ./packages/
COPY apps/frontend/ ./apps/frontend/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the app using turbo
RUN turbo build --filter=frontend

# Production phase
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/apps/frontend/public ./apps/frontend/public
COPY --from=builder /app/apps/frontend/.next ./apps/frontend/.next
COPY --from=builder /app/apps/frontend/package.json ./apps/frontend/package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
WORKDIR /app/apps/frontend
CMD ["npm", "start"]
