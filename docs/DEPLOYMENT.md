# 🚀 Guide de Déploiement AI Ad Maker

## 📋 Prérequis

### **Infrastructure**
- **Node.js** 20+
- **PostgreSQL** 16+
- **Redis** 6+
- **pnpm** 8+

### **Services Externes**
- **OpenAI** API Key
- **Google AI** API Key
- **ElevenLabs** API Key
- **Notion** API Key
- **Slack** App Token
- **S3** Bucket (AWS/Cloudflare)

## 🏗️ Architecture de Déploiement

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Backend   │    │   Workers       │
│   (Vercel)      │◄──►│   (Fly.io)      │◄──►│   (Fly.io)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN           │    │   PostgreSQL    │    │   Redis         │
│   (Cloudflare)  │    │   (Fly.io)      │    │   (Fly.io)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   S3 Storage    │    │   Monitoring    │    │   Logs          │
│   (AWS)         │    │   (Grafana)     │    │   (Sentry)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Déploiement Local

### **1. Setup Initial**

```bash
# Cloner le repository
git clone https://github.com/your-org/ai-ad-maker.git
cd ai-ad-maker

# Installer les dépendances
pnpm install

# Configuration
cp env.example .env
# Éditer .env avec vos clés API

# Setup de la base de données
pnpm db:generate
pnpm db:push

# Démarrer les services
pnpm dev
```

### **2. Avec Docker**

```bash
# Démarrer l'infrastructure
docker-compose up -d

# Vérifier les services
docker-compose ps

# Voir les logs
docker-compose logs -f
```

## 🌐 Déploiement Production

### **1. Frontend (Vercel)**

```bash
# Installer Vercel CLI
npm i -g vercel

# Login
vercel login

# Déployer
vercel --prod

# Configuration des variables d'environnement
vercel env add NEXT_PUBLIC_API_URL
vercel env add OPENAI_API_KEY
vercel env add GOOGLE_AI_API_KEY
# ... autres variables
```

### **2. API Backend (Fly.io)**

```bash
# Installer Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Créer l'app
fly apps create ai-ad-maker-api

# Déployer
fly deploy

# Configuration des secrets
fly secrets set DATABASE_URL="postgresql://..."
fly secrets set REDIS_URL="redis://..."
fly secrets set OPENAI_API_KEY="sk-..."
# ... autres secrets
```

### **3. Workers (Fly.io)**

```bash
# Créer l'app workers
fly apps create ai-ad-maker-workers

# Déployer
fly deploy --config fly.workers.toml

# Configuration des secrets
fly secrets set DATABASE_URL="postgresql://..."
fly secrets set REDIS_URL="redis://..."
# ... autres secrets
```

### **4. Base de Données (Fly.io)**

```bash
# Créer la base de données
fly postgres create ai-ad-maker-db

# Connecter l'app à la DB
fly postgres attach ai-ad-maker-db --app ai-ad-maker-api

# Migrations
fly ssh console -a ai-ad-maker-api
pnpm db:migrate
```

### **5. Redis (Fly.io)**

```bash
# Créer Redis
fly redis create ai-ad-maker-redis

# Connecter l'app à Redis
fly redis attach ai-ad-maker-redis --app ai-ad-maker-api
```

## 🔧 Configuration

### **Variables d'Environnement**

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/ai_ad_maker"
REDIS_URL="redis://host:6379"

# OpenAI
OPENAI_API_KEY="sk-..."
OPENAI_ORG_ID="org-..."

# Google AI
GOOGLE_AI_API_KEY="..."
GOOGLE_AI_PROJECT_ID="..."

# Media Generation
SEEDREAM_API_KEY="..."
SEEDANCE_API_KEY="..."
KLING_API_KEY="..."
ELEVENLABS_API_KEY="..."
SUNO_API_KEY="..."

# Integrations
NOTION_API_KEY="secret_..."
SLACK_BOT_TOKEN="xoxb-..."
SLACK_SIGNING_SECRET="..."

# Storage
S3_BUCKET="ai-ad-maker-assets"
S3_REGION="us-east-1"
S3_ACCESS_KEY="..."
S3_SECRET_KEY="..."

# Monitoring
LANGSMITH_API_KEY="..."
SENTRY_DSN="..."
GRAFANA_URL="..."

# Security
JWT_SECRET="..."
ENCRYPTION_KEY="..."
```

### **Configuration Fly.io**

```toml
# fly.toml
app = "ai-ad-maker-api"
primary_region = "par"

[build]

[env]
  NODE_ENV = "production"
  PORT = "3001"

[http_service]
  internal_port = 3001
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 1
  processes = ["app"]

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 1024

[[statics]]
  guest_path = "/app/public"
  url_prefix = "/static"
```

## 📊 Monitoring

### **1. Métriques avec Grafana**

```yaml
# docker-compose.monitoring.yml
version: '3.8'
services:
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
  
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus

volumes:
  grafana_data:
  prometheus_data:
```

### **2. Logs avec Sentry**

```typescript
// apps/api/src/lib/sentry.ts
import * as Sentry from '@sentry/node'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
})

export { Sentry }
```

### **3. Health Checks**

```typescript
// apps/api/src/routes/health.ts
export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async (request, reply) => {
    const checks = {
      database: await checkDatabase(),
      redis: await checkRedis(),
      external_apis: await checkExternalAPIs(),
    }
    
    const isHealthy = Object.values(checks).every(check => check.status === 'ok')
    
    reply.status(isHealthy ? 200 : 503).send({
      status: isHealthy ? 'healthy' : 'unhealthy',
      checks,
      timestamp: new Date().toISOString(),
    })
  })
}
```

## 🔒 Sécurité

### **1. HTTPS/TLS**

```nginx
# nginx.conf
server {
    listen 443 ssl http2;
    server_name api.ai-ad-maker.com;
    
    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### **2. Rate Limiting**

```typescript
// apps/api/src/plugins/rate-limit.ts
import rateLimit from '@fastify/rate-limit'

export async function rateLimitPlugin(fastify: FastifyInstance) {
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    keyGenerator: (request) => {
      return request.headers['x-forwarded-for'] || request.ip
    },
  })
}
```

### **3. CORS**

```typescript
// apps/api/src/plugins/cors.ts
import cors from '@fastify/cors'

export async function corsPlugin(fastify: FastifyInstance) {
  await fastify.register(cors, {
    origin: [
      'https://ai-ad-maker.com',
      'https://app.ai-ad-maker.com',
    ],
    credentials: true,
  })
}
```

## 🧪 Testing

### **1. Tests Unitaires**

```bash
# Exécuter les tests
pnpm test

# Coverage
pnpm test:coverage

# Watch mode
pnpm test:watch
```

### **2. Tests E2E**

```bash
# Installer Playwright
pnpm playwright install

# Exécuter les tests
pnpm test:e2e

# Tests en mode headless
pnpm test:e2e:headless
```

### **3. Tests de Performance**

```bash
# Installer K6
brew install k6

# Tests de charge
pnpm test:perf

# Tests de stress
pnpm test:stress
```

## 🔄 CI/CD

### **1. GitHub Actions**

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### **2. Déploiement Automatique**

```bash
# Script de déploiement
#!/bin/bash
set -e

echo "🚀 Déploiement AI Ad Maker"

# Tests
pnpm test
pnpm test:e2e

# Build
pnpm build

# Déploiement
vercel --prod
fly deploy

echo "✅ Déploiement terminé"
```

## 📈 Optimisation

### **1. Performance**

```typescript
// Optimisation des requêtes
const workflows = await prisma.workflow.findMany({
  select: {
    id: true,
    name: true,
    status: true,
    _count: {
      select: { jobs: true }
    }
  },
  take: 20,
  orderBy: { createdAt: 'desc' }
})
```

### **2. Caching**

```typescript
// Redis caching
const cacheKey = `workflow:${workflowId}`
const cached = await redis.get(cacheKey)

if (cached) {
  return JSON.parse(cached)
}

const workflow = await getWorkflow(workflowId)
await redis.setex(cacheKey, 3600, JSON.stringify(workflow))
return workflow
```

### **3. CDN**

```typescript
// Configuration CDN
const cdnUrl = process.env.CDN_URL || 'https://cdn.ai-ad-maker.com'
const assetUrl = `${cdnUrl}/assets/${assetId}`
```

## 🆘 Dépannage

### **1. Logs**

```bash
# Logs de l'API
fly logs -a ai-ad-maker-api

# Logs des workers
fly logs -a ai-ad-maker-workers

# Logs de la base de données
fly logs -a ai-ad-maker-db
```

### **2. Debug**

```bash
# SSH dans l'app
fly ssh console -a ai-ad-maker-api

# Vérifier les services
fly status -a ai-ad-maker-api

# Redémarrer l'app
fly restart -a ai-ad-maker-api
```

### **3. Monitoring**

```bash
# Métriques
fly metrics -a ai-ad-maker-api

# Health check
curl https://api.ai-ad-maker.com/health

# Status des workers
curl https://api.ai-ad-maker.com/api/workers/status
```

---

**🎉 Votre plateforme AI Ad Maker est maintenant déployée et prête à l'emploi !**

*Pour plus d'aide, consultez notre [documentation complète](https://docs.ai-ad-maker.com) ou contactez notre équipe support.*
