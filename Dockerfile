FROM node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN npm install -g turbo

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

CMD ["turbo", "dev"]