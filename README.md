# 🚀 AI Ad Maker - Agence Marketing IA SOTA 2025

Une plateforme révolutionnaire d'orchestration d'agents IA pour automatiser entièrement le processus de création publicitaire, du brief initial à la livraison finale.

## 🌟 Fonctionnalités Principales

### Agents IA Spécialisés
- **Brief Generator** : Génère des briefs créatifs complets
- **Brief Judge** : Compare et évalue les briefs
- **Prompt Smith** : Optimise les prompts pour génération
- **Image Artisan** : Génère images de référence et variantes
- **Animator** : Anime les images en vidéos
- **Editor** : Monte et finalise les vidéos
- **Music Generator** : Génère musique et bandes sonores
- **Voice Generator** : Synthèse vocale multilingue
- **Spec Check** : Valide les spécifications par plateforme
- **Compliance** : Vérifie conformité et droits

### Intégrations API
- **OpenAI** : GPT-4o, DALL-E 3, Whisper
- **Google AI** : Gemini 2.0, Imagen 4, Veo 3.1
- **Seedream 4.0** : Génération d'images avancée
- **Seedance Pro/Lite** : Vidéo générative
- **Kling 2.5** : Animation vidéo
- **ElevenLabs** : Synthèse vocale
- **Suno** : Génération musicale (expérimental)
- **Notion** : Gestion de projets et briefs
- **Slack** : Notifications et collaboration

### Interface Utilisateur
- **Canvas React Flow** : Builder de workflows drag-and-drop
- **Dashboard Temps Réel** : Suivi des exécutions
- **Asset Library** : Gestion des médias
- **Analytics** : Performance des campagnes

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Backend   │    │   Workers       │
│   (Next.js 15)  │◄──►│   (Fastify)     │◄──►│   (BullMQ)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Flow    │    │   LangGraph     │    │   Image Worker  │
│   Canvas        │    │   Orchestrator  │    │   Video Worker  │
└─────────────────┘    └─────────────────┘    │   Audio Worker  │
                                              │   Export Worker │
                                              └─────────────────┘
```

## 🚀 Installation

### Prérequis
- Node.js 20+
- PostgreSQL 16+
- Redis 6+
- pnpm 8+

### Setup Rapide

```bash
# Cloner le repository
git clone https://github.com/your-org/ai-ad-maker.git
cd ai-ad-maker

# Installer les dépendances
pnpm install

# Configuration des variables d'environnement
cp env.example .env
# Éditer .env avec vos clés API

# Setup de la base de données
pnpm db:generate
pnpm db:push

# Démarrer en mode développement
pnpm dev
```

### Variables d'Environnement

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ai_ad_maker"
REDIS_URL="redis://localhost:6379"

# OpenAI
OPENAI_API_KEY="sk-..."
OPENAI_ORG_ID="org-..."

# Google AI
GOOGLE_AI_API_KEY="..."
GOOGLE_AI_PROJECT_ID="..."

# Media Generation APIs
SEEDREAM_API_KEY="..."
SEEDANCE_API_KEY="..."
KLING_API_KEY="..."
ELEVENLABS_API_KEY="..."
SUNO_API_KEY="..." # ⚠️ Experimental

# Notion & Slack
NOTION_API_KEY="secret_..."
SLACK_BOT_TOKEN="xoxb-..."
SLACK_SIGNING_SECRET="..."

# Storage
S3_BUCKET="ai-ad-maker-assets"
S3_REGION="us-east-1"
S3_ACCESS_KEY="..."
S3_SECRET_KEY="..."

# LangSmith
LANGSMITH_API_KEY="..."
LANGSMITH_PROJECT="ai-ad-maker"
```

## 📖 Guide d'Utilisation

### 1. Créer un Workflow

1. Ouvrez l'interface web
2. Glissez-déposez les agents depuis la sidebar
3. Connectez les nœuds avec des arêtes
4. Configurez chaque agent
5. Sauvegardez le workflow

### 2. Exécuter un Workflow

```bash
# Via l'interface web
1. Cliquez sur "Exécuter"
2. Suivez le progrès en temps réel
3. Recevez les notifications Slack

# Via API
curl -X POST http://localhost:3001/api/workflows/run \
  -H "Content-Type: application/json" \
  -d '{
    "workflowId": "workflow_123",
    "inputs": {
      "brand": "Nike",
      "product": "Air Max",
      "objective": "Augmenter les ventes de 20%"
    }
  }'
```

### 3. Commandes Slack

```bash
# Créer une nouvelle campagne
/ads new Nike Air Max - Augmenter les ventes

# Vérifier le statut
/ads status job_123

# Lister les campagnes
/ads list

# Approuver un job
/approve job_123
```

## 🔧 Développement

### Structure du Projet

```
ai-ad-maker/
├── apps/
│   ├── web/                 # Frontend Next.js
│   └── api/                 # Backend Fastify
├── packages/
│   ├── agents/              # Agents IA LangGraph
│   └── connectors/          # Connecteurs API
└── docs/                    # Documentation
```

### Scripts Disponibles

```bash
# Développement
pnpm dev                    # Démarrer tous les services
pnpm build                  # Build de production
pnpm test                   # Exécuter les tests
pnpm lint                   # Linter le code

# Base de données
pnpm db:generate           # Générer le client Prisma
pnpm db:push               # Pousser le schéma
pnpm db:migrate            # Créer une migration
pnpm db:studio             # Interface Prisma Studio

# Workers
pnpm queue:dev             # Démarrer les workers
pnpm agents:dev            # Démarrer l'orchestrateur
```

### Tests

```bash
# Tests unitaires
pnpm test:unit

# Tests d'intégration
pnpm test:integration

# Tests e2e
pnpm test:e2e

# Tests de performance
pnpm test:perf
```

## 🎯 Cas d'Usage

### Campagne E-commerce
1. **Brief** : "Promouvoir la nouvelle collection Nike"
2. **Images** : Photos produits + lifestyle
3. **Vidéos** : Animations produits + testimonials
4. **Audio** : Musique énergique + voix off
5. **Export** : Formats Facebook, Instagram, TikTok

### Campagne B2B
1. **Brief** : "Démontrer l'efficacité de notre solution SaaS"
2. **Images** : Interface produit + équipe
3. **Vidéos** : Démonstrations + témoignages clients
4. **Audio** : Musique professionnelle + narration
5. **Export** : Formats LinkedIn, YouTube, Twitter

## 📊 Monitoring & Observabilité

### Métriques Clés
- **Taux de succès** : % de workflows complétés
- **Temps d'exécution** : Durée moyenne par agent
- **Coûts** : Coût par génération de média
- **Qualité** : Scores de validation automatique

### Dashboards
- **Grafana** : Métriques système
- **LangSmith** : Traces des agents IA
- **Slack** : Notifications temps réel

## 🔒 Sécurité

### Authentification
- **JWT** : Tokens d'accès sécurisés
- **RBAC** : Rôles admin/pm/creative/traffic
- **OAuth** : Intégration Google/Microsoft

### Conformité
- **RGPD** : Protection des données personnelles
- **Watermarking** : SynthID pour les images générées
- **Audit** : Logs complets des actions

## 🚀 Déploiement

### Production

```bash
# Build de production
pnpm build

# Déploiement Vercel (Frontend)
vercel deploy

# Déploiement Fly.io (Backend)
fly deploy

# Déploiement Workers
fly deploy --config fly.workers.toml
```

### Infrastructure

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: ai_ad_maker
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
  
  redis:
    image: redis:7-alpine
  
  api:
    build: ./apps/api
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://user:password@postgres:5432/ai_ad_maker
      REDIS_URL: redis://redis:6379
```

## 🤝 Contribution

### Workflow de Contribution

1. Fork le repository
2. Créer une branche feature
3. Commiter les changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

### Standards de Code

- **TypeScript** strict
- **ESLint** + **Prettier**
- **Tests** obligatoires
- **Documentation** à jour

## 📄 Licence

MIT License - Voir [LICENSE](LICENSE) pour plus de détails.

## 🆘 Support

- **Documentation** : [docs.ai-ad-maker.com](https://docs.ai-ad-maker.com)
- **Issues** : [GitHub Issues](https://github.com/your-org/ai-ad-maker/issues)
- **Discord** : [Discord Community](https://discord.gg/ai-ad-maker)
- **Email** : support@ai-ad-maker.com

---

**Fait avec ❤️ par l'équipe AI Ad Maker**
