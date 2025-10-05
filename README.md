# 📇 Stampee Contact Management System

Application full-stack de gestion de contacts avec authentification, permettant de gérer des contacts individuels et professionnels.

##  Démarrage rapide

### Avec Docker (Recommandé)

```bash
# Cloner le repository
cd stampee-tech-awd

# Lancer l'application
docker compose up

# L'application sera accessible sur :
# - Frontend : http://localhost:8080
# - Backend API : http://localhost:3000
# - PostgreSQL : localhost:5432
```

### Pour le développement en local (sans Docker)

**Prérequis :**
- Node.js 20+
- pnpm (`npm install -g pnpm`)
- Docker (pour PostgreSQL)
- Task (https://taskfile.dev)

**Étape 1 : Démarrer PostgreSQL**
```bash
# Lancer uniquement le container PostgreSQL
docker run -d \
  --name stampee-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=stampee_contacts \
  -p 5432:5432 \
  postgres:18-alpine
```

**Étape 2 : Installer les dépendances**
```bash
# À la racine du projet
pnpm install
```

**Étape 3 : Configurer les variables d'environnement**
```bash
# Backend
cd server
cp .env.example .env
```

Éditer `server/.env` avec vos valeurs :
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/stampee_contacts
JWT_SECRET=     # À générer (voir ci-dessous)
PORT=3000
FRONTEND_URL=http://localhost:5173
```

**Générer le JWT_SECRET :**
```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# OU OpenSSL
openssl rand -hex 32
```

```bash
# Frontend
cd ../frontend
cp .env.example .env
```

Éditer `frontend/.env` :
```env
VITE_API_URL=http://localhost:3000/api
```

**Étape 4 : Initialiser la base de données**
```bash
# À la racine du projet
cd server
pnpm db:generate
pnpm db:push
```

**Étape 5 : Lancer l'application**
```bash
# À la racine du projet
task dev
```

**L'application sera accessible sur :**
- Frontend : http://localhost:5173
- Backend API : http://localhost:3000
- PostgreSQL : localhost:5432

**Commandes utiles :**
```bash
# Arrêter PostgreSQL
docker stop stampee-postgres

# Redémarrer PostgreSQL
docker start stampee-postgres

# Supprimer le container
docker rm -f stampee-postgres
```

---

##  Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Stack technique](#stack-technique)
- [Choix Techniques ](#choix-techniques)
- [Structure du projet](#structure-du-projet)
- [API Documentation](#api-documentation)
- [Configuration](#configuration)
- [Docker](#docker)

---

##  Fonctionnalités

### Authentification
- Inscription avec email et mot de passe sécurisé
- Connexion avec JWT
- Session persistante
- Protection des routes

### Gestion des contacts

#### Types de contacts
- **Individual** : Prénom, nom, email
- **Professional** : Nom d'entreprise, SIREN (9 chiffres), email

#### Opérations CRUD
- Créer un contact
- Lister tous les contacts
- Rechercher/filtrer par nom ou email
- Modifier un contact (type verrouillé)
- Supprimer un contact

#### Interface utilisateur
- Vue **Liste** : Affichage compact horizontal
- Vue **Mosaïque** : Cards uniformes en grille
- Recherche en temps réel
- Validation des formulaires
- Messages d'erreur contextuels
- Protection contre double-soumission

### Sécurité
- Mots de passe hashés (bcrypt)
- Tokens JWT
- Validation côté client et serveur
- CORS configuré
- Protection contre les doublons
- Isolation des données par utilisateur

---

##  Architecture

```
┌──────────────────┐
│   Client (Web)   │
│   Vue.js + Nginx │
│   Port: 8080     │
└────────┬─────────┘
         │ HTTP/REST
         ↓
┌──────────────────┐
│   Backend API    │
│   Fastify/Node   │
│   Port: 3000     │
└────────┬─────────┘
         │ SQL
         ↓
┌──────────────────┐
│   Database       │
│   PostgreSQL     │
│   Port: 5432     │
└──────────────────┘
```
---

## 🛠️ Stack technique

### Frontend
- **Framework** : Vue 3 (Composition API)
- **Language** : TypeScript
- **UI Library** : Vuetify 3 (Material Design)
- **State Management** : Pinia
- **Routing** : Vue Router
- **HTTP Client** : Axios
- **Build Tool** : Vite

### Backend
- **Runtime** : Node.js 20
- **Framework** : Fastify
- **Language** : TypeScript
- **ORM** : Drizzle ORM
- **Database** : PostgreSQL 18
- **Validation** : Zod
- **Authentication** : JWT + bcrypt

### DevOps
- **Containerization** : Docker + Docker Compose
- **Package Manager** : pnpm
- **Version Control** : Git

---
## Choix Techniques  

### Architecture générale  
L’application adopte une architecture **monorepo** basée sur **pnpm workspaces**, facilitant le partage de types TypeScript entre le frontend et le backend tout en maintenant une séparation claire des responsabilités. Cette structure favorise la réutilisation du code, accélère le développement et simplifie le déploiement via **Docker Compose**, garantissant un environnement cohérent et reproductible.  

### Backend  
Le backend est construit avec **Fastify** pour ses performances élevées et son excellent support TypeScript. L’utilisation de **Drizzle ORM** assure une type-safety complète et un contrôle fin sur les requêtes SQL. L’authentification repose sur des **JWT** pour un fonctionnement stateless et une mise à l’échelle aisée, tandis que **Zod** renforce la validation des données. Les mots de passe sont protégés avec **bcrypt**, garantissant une sécurité robuste et éprouvée.  

### Frontend  
Le frontend s’appuie sur **Vue 3** avec la **Composition API** pour une meilleure réutilisation de la logique et une intégration fluide avec TypeScript. **Vuetify 3** fournit des composants accessibles et responsives suivant les standards Material Design, et **Pinia** simplifie la gestion d’état avec une API moderne et typée. Grâce à **Vite**, le développement bénéficie d’un rechargement instantané et d’un build optimisé. L’interface offre une expérience utilisateur fluide avec une recherche en temps réel et deux modes de visualisation adaptés aux différents usages.  

---

##  Structure du projet

```
stampee-tech-awd/
├── server/                      # Backend API
│   ├── src/
│   │   ├── controllers/         # Logique métier
│   │   ├── db/                  # Base de données
│   │   │   ├── schema.ts        # Schéma Drizzle
│   │   │   └── db.ts            # Connexion
│   │   ├── middleware/          # Middleware Express
│   │   ├── routes/              # Définition des routes
│   │   ├── utils/               # Utilitaires (JWT, hash)
│   │   ├── validators/          # Schémas Zod
│   │   └── index.ts             # Point d'entrée
│   ├── drizzle/                 # Migrations
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                    # Application Vue
│   ├── src/
│   │   ├── components/          # Composants réutilisables
│   │   ├── views/               # Pages principales
│   │   ├── stores/              # Stores Pinia
│   │   ├── services/            # API client
│   │   ├── router/              # Configuration routes
│   │   └── main.ts              # Point d'entrée
│   ├── nginx.conf               # Config Nginx
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml           # Orchestration Docker
├── DOCKER.md                    # Doc Docker
└── README.md                    # Ce fichier
```


---

##  API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentification

#### POST `/auth/register`
Créer un nouveau compte utilisateur.

**Body :**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response :** `201 Created`
```json
{
  "message": "Inscription réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST `/auth/login`
Se connecter avec des identifiants existants.

**Body :**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response :** `200 OK`
```json
{
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

#### GET `/auth/me`
Obtenir les informations de l'utilisateur connecté.

**Headers :**
```
Authorization: Bearer <token>
```

**Response :** `200 OK`
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Contacts

Toutes les routes contacts nécessitent l'authentification (header `Authorization: Bearer <token>`).

#### GET `/contacts`
Lister tous les contacts de l'utilisateur.

**Query params :**
- `search` (optionnel) : Filtrer par nom ou email

**Response :** `200 OK`
```json
{
  "contacts": [
    {
      "id": 1,
      "type": "individual",
      "firstName": "Jean",
      "lastName": "Dupont",
      "email": "jean.dupont@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### POST `/contacts`
Créer un nouveau contact.

**Body (Individual) :**
```json
{
  "type": "individual",
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@example.com"
}
```

**Body (Professional) :**
```json
{
  "type": "professional",
  "companyName": "Acme Corp",
  "sirenNumber": "123456789",
  "email": "contact@acme.com"
}
```

**Response :** `201 Created`

#### GET `/contacts/:id`
Obtenir un contact spécifique.

**Response :** `200 OK`

#### PUT `/contacts/:id`
Modifier un contact existant.

**Response :** `200 OK`

#### DELETE `/contacts/:id`
Supprimer un contact.

**Response :** `200 OK`

---

##  Configuration

### Variables d'environnement

#### Backend (`server/.env`)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/stampee_contacts
JWT_SECRET=your_super_secret_jwt_key_minimum_32_chars
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

#### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:3000/api
```
---

##  Docker

Voir [DOCKER.md](./DOCKER.md) pour la documentation complète Docker.

**Commandes principales :**
```bash
docker compose up           # Démarrer
docker compose down         # Arrêter
docker compose logs -f      # Voir les logs
docker compose build        # Rebuild les images
```

---



##  Auteur

Abdou Wahab DIALLO - Test technique Stampee

---

##  Remerciements

Merci à toute l'équipe de Stampee pour l'opportunité de ce test technique
