FROM node:22-alpine AS base

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.13.1 --activate

FROM base AS builder

ARG APP_NAME

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm turbo run build --filter=${APP_NAME}

FROM base AS runner

ARG APP_NAME

ENV NODE_ENV=production
ENV APP_NAME=${APP_NAME}

COPY --from=builder /app /app

CMD ["sh", "-c", "pnpm --filter ${APP_NAME} start:prod || pnpm --filter ${APP_NAME} start"]