# Docker Setup

## Démarrage rapide

### Prérequis
- Docker Desktop installé
- Docker Compose v2+

### Lancer l'application

```bash
# À la racine du projet
docker compose up
```

**C'est tout !** 

L'application sera accessible sur :
-  **Frontend** : http://localhost:8080
- **Backend API** : http://localhost:3000
- **PostgreSQL** : localhost:5432

---

## 📋 Services

| Service | Port | Description |
|---------|------|-------------|
| **frontend** | 8080 | Application Vue.js avec Nginx |
| **backend** | 3000 | API Fastify Node.js |
| **database** | 5432 | PostgreSQL 18 |

---

##  Commandes utiles

### Démarrer l'application
```bash
docker compose up
```

### Démarrer en arrière-plan
```bash
docker compose up -d
```

### Voir les logs
```bash
# Tous les services
docker compose logs -f

# Service spécifique
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f database
```

### Arrêter l'application
```bash
docker compose down
```

### Arrêter et supprimer les volumes
```bash
docker compose down -v
```

### Rebuild les images
```bash
docker compose build

# Rebuild sans cache
docker compose build --no-cache
```

### Restart un service
```bash
docker compose restart backend
```

---

## Configuration

### Variables d'environnement

Les variables sont définies dans `docker compose.yml` :

**Backend :**
- `DATABASE_URL` : Connexion PostgreSQL
- `JWT_SECRET` : Secret pour les tokens JWT  (**À changer en production !**)
- `PORT` : Port du serveur (3000)
- `FRONTEND_URL` : URL du frontend pour CORS

**Frontend :**
- `VITE_API_URL` : URL de l'API backend

### Modifier les ports

Dans `docker compose.yml`, modifier la section `ports` :

```yaml
frontend:
  ports:
    - "8080:80"  # Change 8080 par le port souhaité
```

---

## Architecture

```
┌─────────────────┐
│   Frontend      │
│   (Vue.js)      │
│   Port: 8080    │
└────────┬────────┘
         │
         ↓ HTTP
┌─────────────────┐
│   Backend       │
│   (Fastify)     │
│   Port: 3000    │
└────────┬────────┘
         │
         ↓ PostgreSQL
┌─────────────────┐
│   Database      │
│   (PostgreSQL)  │
│   Port: 5432    │
└─────────────────┘
```
