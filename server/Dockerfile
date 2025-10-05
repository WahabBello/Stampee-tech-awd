# Étape 1: Base image
FROM node:20-alpine AS base
WORKDIR /app

# Installer pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Étape 2: Dependencies
FROM base AS dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Étape 3: Build
FROM base AS build
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Étape 4: Production
FROM base AS production
ENV NODE_ENV=production

# Copier les dépendances de production
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod

# Copier le code compilé
COPY --from=build /app/dist ./dist
COPY --from=build /app/drizzle ./drizzle
COPY --from=build /app/src/db ./src/db
COPY --from=build /app/drizzle.config.ts ./

# Exposer le port
EXPOSE 3000

# Commande de démarrage
CMD ["node", "dist/index.js"]