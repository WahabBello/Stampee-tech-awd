# 🐳 Docker Setup

## Démarrage rapide

### Prérequis
- Docker Desktop installé
- Docker Compose v2+

### Lancer l'application

```bash
# À la racine du projet
docker-compose up
```

**C'est tout !** 🎉

L'application sera accessible sur :
- 🌐 **Frontend** : http://localhost:8080
- 🔌 **Backend API** : http://localhost:3000
- 🗄️ **PostgreSQL** : localhost:5432

---

## 📋 Services

| Service | Port | Description |
|---------|------|-------------|
| **frontend** | 8080 | Application Vue.js avec Nginx |
| **backend** | 3000 | API Fastify Node.js |
| **database** | 5432 | PostgreSQL 18 |

---

## 🛠️ Commandes utiles

### Démarrer l'application
```bash
docker-compose up
```

### Démarrer en arrière-plan
```bash
docker-compose up -d
```

### Voir les logs
```bash
# Tous les services
docker-compose logs -f

# Service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database
```

### Arrêter l'application
```bash
docker-compose down
```

### Arrêter et supprimer les volumes (⚠️ supprime la base de données)
```bash
docker-compose down -v
```

### Rebuild les images
```bash
docker-compose build

# Rebuild sans cache
docker-compose build --no-cache
```

### Restart un service
```bash
docker-compose restart backend
```

---

## 🔧 Configuration

### Variables d'environnement

Les variables sont définies dans `docker-compose.yml` :

**Backend :**
- `DATABASE_URL` : Connexion PostgreSQL
- `JWT_SECRET` : Secret pour les tokens JWT ⚠️ **À changer en production !**
- `PORT` : Port du serveur (3000)
- `FRONTEND_URL` : URL du frontend pour CORS

**Frontend :**
- `VITE_API_URL` : URL de l'API backend

### Modifier les ports

Dans `docker-compose.yml`, modifier la section `ports` :

```yaml
frontend:
  ports:
    - "8080:80"  # Change 8080 par le port souhaité
```

---

## 🗄️ Base de données

### Accéder à PostgreSQL

```bash
# Via Docker
docker-compose exec database psql -U postgres -d stampee_contacts

# Ou avec un client externe
Host: localhost
Port: 5432
Database: stampee_contacts
User: postgres
Password: postgres
```

### Backup de la base de données

```bash
docker-compose exec database pg_dump -U postgres stampee_contacts > backup.sql
```

### Restaurer un backup

```bash
docker-compose exec -T database psql -U postgres stampee_contacts < backup.sql
```

### Migrations

Les migrations Drizzle sont automatiquement exécutées au démarrage du backend via :
```bash
pnpm db:push && node dist/index.js
```

---

## 🐛 Troubleshooting

### Le backend ne démarre pas

**Vérifier les logs :**
```bash
docker-compose logs backend
```

**Problème courant :** La base de données n'est pas prête
- Solution : Le backend attend automatiquement que la DB soit healthy

### Le frontend affiche des erreurs API

**Vérifier que le backend est accessible :**
```bash
curl http://localhost:3000/api/health
```

**Si l'API n'est pas accessible depuis le navigateur :**
- Vérifier que `VITE_API_URL` pointe vers `http://localhost:3000/api`
- Rebuild le frontend : `docker-compose build frontend`

### Port déjà utilisé

**Erreur :** `Bind for 0.0.0.0:3000 failed: port is already allocated`

**Solution :**
1. Arrêter l'application qui utilise le port
2. Ou modifier le port dans `docker-compose.yml`

### Reconstruire depuis zéro

```bash
# Arrêter et tout supprimer
docker-compose down -v

# Supprimer les images
docker-compose down --rmi all

# Rebuild complet
docker-compose build --no-cache
docker-compose up
```

---

## 🚀 Production

### ⚠️ Avant de déployer

1. **Changer le JWT_SECRET**
   ```yaml
   JWT_SECRET: un_secret_tres_long_et_aleatoire_genere_securise
   ```

2. **Changer le mot de passe PostgreSQL**
   ```yaml
   POSTGRES_PASSWORD: un_mot_de_passe_securise
   ```

3. **Utiliser des variables d'environnement externes**
   Créer un fichier `.env` à la racine et utiliser `env_file` dans docker-compose.yml

4. **Configurer HTTPS** avec un reverse proxy (Nginx, Traefik, Caddy)

5. **Backup automatique de la base de données**

---

## 📊 Architecture

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

---

## 📝 Notes

- Les données PostgreSQL sont persistées dans un volume Docker (`postgres_data`)
- Le frontend est servi par Nginx en production
- Le backend utilise Node.js 20 Alpine (image légère)
- Tous les services sont dans le même réseau Docker (`stampee-network`)