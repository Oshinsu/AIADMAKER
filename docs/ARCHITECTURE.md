# 🏗️ Architecture AI Ad Maker

## Vue d'Ensemble

AI Ad Maker est une plateforme d'orchestration d'agents IA construite avec une architecture microservices moderne, utilisant les technologies SOTA 2025.

## 🎯 Principes Architecturaux

### 1. **Modularité**
- Monorepo avec packages séparés
- Agents IA indépendants et réutilisables
- Connecteurs API modulaires

### 2. **Scalabilité**
- Workers asynchrones avec BullMQ
- Queue system avec Redis
- Auto-scaling des workers

### 3. **Observabilité**
- Logging structuré avec Pino
- Métriques avec OpenTelemetry
- Traces avec LangSmith

### 4. **Sécurité**
- RBAC (Role-Based Access Control)
- Chiffrement des données sensibles
- Audit logs complets

## 🏛️ Architecture Générale

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Layer                           │
├─────────────────────────────────────────────────────────────────┤
│  Next.js 15 + React Flow + shadcn/ui + Tailwind CSS 4         │
│  • Canvas de workflow drag-and-drop                           │
│  • Dashboard temps réel                                        │
│  • Asset library                                              │
│  • Analytics & monitoring                                     │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API Gateway                              │
├─────────────────────────────────────────────────────────────────┤
│  Fastify + TypeScript + Zod + Rate Limiting                   │
│  • Authentication & Authorization                             │
│  • Request/Response validation                                │
│  • Rate limiting & security                                   │
│  • WebSocket for real-time updates                            │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Orchestration Layer                          │
├─────────────────────────────────────────────────────────────────┤
│  LangGraph + LangChain + OpenAI + CrewAI                     │
│  • Workflow orchestration                                     │
│  • Agent coordination                                         │
│  • State management                                           │
│  • Error handling & retries                                   │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Agents Layer                               │
├─────────────────────────────────────────────────────────────────┤
│  • Brief Generator (GPT-4o)                                   │
│  • Brief Judge (Claude 3.5)                                   │
│  • Prompt Smith (GPT-4o)                                      │
│  • Image Artisan (Seedream 4.0, Gemini)                       │
│  • Animator (Veo 3.1, Seedance, Kling)                       │
│  • Editor (FFmpeg + AI)                                       │
│  • Music Generator (Suno, ElevenLabs)                        │
│  • Voice Generator (ElevenLabs)                               │
│  • Spec Check (Validation)                                    │
│  • Compliance (Legal check)                                  │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Workers Layer                                │
├─────────────────────────────────────────────────────────────────┤
│  BullMQ + Redis + Specialized Workers                         │
│  • Image Worker (Seedream, Gemini)                            │
│  • Video Worker (Veo, Seedance, Kling)                        │
│  • Audio Worker (ElevenLabs, Suno)                            │
│  • Export Worker (FFmpeg, S3)                                 │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Data Layer                                   │
├─────────────────────────────────────────────────────────────────┤
│  PostgreSQL + Prisma + Redis + S3                             │
│  • Workflow definitions                                        │
│  • Job execution logs                                          │
│  • Asset metadata                                             │
│  • User management                                            │
│  • Caching & sessions                                          │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                  External Services Layer                        │
├─────────────────────────────────────────────────────────────────┤
│  • OpenAI (GPT-4o, DALL-E 3, Whisper)                         │
│  • Google AI (Gemini, Imagen, Veo)                            │
│  • Seedream 4.0 (Image generation)                            │
│  • Seedance Pro/Lite (Video generation)                       │
│  • Kling 2.5 (Video animation)                                │
│  • ElevenLabs (Voice synthesis)                              │
│  • Suno (Music generation)                                    │
│  • Notion (Project management)                                │
│  • Slack (Collaboration)                                      │
│  • S3 (Asset storage)                                          │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Flux de Données

### 1. **Workflow Creation**
```
User → Frontend → API → Database
     ← Canvas ← React Flow ←
```

### 2. **Workflow Execution**
```
User → API → Orchestrator → Agents → Workers → External APIs
     ← WebSocket ← Real-time updates ←
```

### 3. **Asset Generation**
```
Agent → Worker → External API → S3 → Database
     ← Result ← Asset URL ←
```

### 4. **Human Approval**
```
Workflow → Slack/Notion → Human → API → Workflow
        ← Notification ←
```

## 🧩 Composants Principaux

### **Frontend (Next.js 15)**
- **Canvas React Flow** : Interface drag-and-drop pour workflows
- **Dashboard** : Monitoring temps réel des exécutions
- **Asset Library** : Gestion des médias générés
- **Analytics** : Métriques de performance

### **API Backend (Fastify)**
- **Authentication** : JWT + RBAC
- **Workflow Management** : CRUD operations
- **Job Execution** : Orchestration des agents
- **WebSocket** : Updates temps réel

### **Agents IA (LangGraph)**
- **Brief Generator** : Génération de briefs créatifs
- **Brief Judge** : Évaluation et sélection
- **Prompt Smith** : Optimisation des prompts
- **Image Artisan** : Génération d'images
- **Animator** : Animation vidéo
- **Editor** : Montage vidéo
- **Music Generator** : Génération musicale
- **Voice Generator** : Synthèse vocale
- **Spec Check** : Validation technique
- **Compliance** : Vérification légale

### **Workers (BullMQ)**
- **Image Worker** : Génération d'images asynchrone
- **Video Worker** : Génération vidéo asynchrone
- **Audio Worker** : Génération audio asynchrone
- **Export Worker** : Export multi-plateformes

### **Data Layer**
- **PostgreSQL** : Données relationnelles
- **Redis** : Cache et queues
- **S3** : Stockage des assets
- **Prisma** : ORM et migrations

## 🔌 Intégrations

### **APIs de Génération**
- **OpenAI** : GPT-4o, DALL-E 3, Whisper
- **Google AI** : Gemini 2.0, Imagen 4, Veo 3.1
- **Seedream 4.0** : Génération d'images avancée
- **Seedance Pro/Lite** : Vidéo générative
- **Kling 2.5** : Animation vidéo
- **ElevenLabs** : Synthèse vocale
- **Suno** : Génération musicale

### **APIs de Productivité**
- **Notion** : Gestion de projets
- **Slack** : Notifications et collaboration
- **S3** : Stockage des assets

## 🚀 Déploiement

### **Environnements**
- **Development** : Docker Compose local
- **Staging** : Vercel + Fly.io
- **Production** : Vercel + Fly.io + S3

### **Infrastructure**
- **Frontend** : Vercel (Next.js)
- **API** : Fly.io (Node.js)
- **Workers** : Fly.io (BullMQ)
- **Database** : PostgreSQL (Fly.io)
- **Cache** : Redis (Fly.io)
- **Storage** : S3 (AWS)

## 📊 Monitoring

### **Métriques**
- **Performance** : Temps de réponse, throughput
- **Business** : Taux de succès, coût par asset
- **Technical** : CPU, mémoire, réseau

### **Logs**
- **Application** : Pino (structured logging)
- **Access** : Nginx logs
- **Errors** : Sentry integration

### **Traces**
- **LangSmith** : Agent execution traces
- **OpenTelemetry** : Distributed tracing
- **Custom** : Workflow execution traces

## 🔒 Sécurité

### **Authentication**
- **JWT** : Tokens d'accès sécurisés
- **RBAC** : Rôles admin/pm/creative/traffic
- **OAuth** : Intégration Google/Microsoft

### **Data Protection**
- **Encryption** : Chiffrement au repos et en transit
- **Secrets** : Gestion sécurisée des clés API
- **Audit** : Logs complets des actions

### **Compliance**
- **RGPD** : Protection des données personnelles
- **Watermarking** : SynthID pour les images générées
- **Legal** : Vérification des droits d'usage

## 🧪 Testing

### **Types de Tests**
- **Unit** : Jest + Testing Library
- **Integration** : API endpoints
- **E2E** : Playwright
- **Performance** : K6
- **Security** : Snyk + CodeQL

### **Coverage**
- **Frontend** : 80%+ coverage
- **API** : 80%+ coverage
- **Agents** : 80%+ coverage

## 📈 Évolutivité

### **Horizontal Scaling**
- **Workers** : Auto-scaling basé sur la queue
- **API** : Load balancing
- **Database** : Read replicas

### **Vertical Scaling**
- **Memory** : Optimisation des agents IA
- **CPU** : Parallélisation des workers
- **Storage** : CDN pour les assets

---

**Cette architecture garantit une scalabilité, une maintenabilité et une performance optimales pour la plateforme AI Ad Maker.**
