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

# Build argument pour l'URL de l'API
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN pnpm build

# Étape 4: Production avec Nginx
FROM nginx:alpine AS production

# Copier la configuration Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers buildés
COPY --from=build /app/dist /usr/share/nginx/html

# Exposer le port
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]