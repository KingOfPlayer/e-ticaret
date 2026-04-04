# 1. AŞAMA: Budama (Pruning)
FROM node:22-alpine AS pruner
WORKDIR /app
RUN npm install -g turbo
COPY . .
ARG APP_NAME
# Sadece ilgili uygulamanın ihtiyaç duyduğu dosyaları ayıklar
RUN turbo prune ${APP_NAME} --docker

# 2. AŞAMA: Bağımlılık Yükleme (Installer)
FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.13.1 --activate

# Sadece lock dosyalarını ve budanmış package.json'ları kopyala
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Bağımlılıkları yükle (Sadece lock dosyası değişirse bu adım çalışır)
RUN pnpm install --frozen-lockfile

# Kaynak kodları kopyala ve build al
COPY --from=pruner /app/out/full/ .
ARG APP_NAME
RUN pnpm turbo run build --filter=${APP_NAME}

# Gereksiz devDependencies'leri temizle (İmajı küçültür)
RUN pnpm prune --prod --no-optional

# 3. AŞAMA: Çalıştırma (Runner)
FROM node:22-alpine AS runner
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.13.1 --activate

ARG APP_NAME
ENV NODE_ENV=production
ENV APP_NAME=${APP_NAME}

# Sadece çalışma anında lazım olanları al (dist, node_modules, package.json)
COPY --from=builder /app /app

CMD ["sh", "-c", "pnpm --filter ${APP_NAME} start:prod || pnpm --filter ${APP_NAME} start"]