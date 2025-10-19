# 📚 Documentation API AI Ad Maker

## 🚀 Endpoints Principaux

### **Base URL**
```
Production: https://api.ai-ad-maker.com
Staging: https://staging-api.ai-ad-maker.com
Development: http://localhost:3001
```

## 🔐 Authentification

### **Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Réponse :**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "creative"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### **Refresh Token**
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 📋 Workflows

### **Créer un Workflow**
```http
POST /api/workflows/create
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Nike Campaign Template",
  "description": "Template pour campagnes Nike",
  "nodes": [
    {
      "id": "brief-gen",
      "type": "agent",
      "position": { "x": 100, "y": 100 },
      "data": {
        "agentType": "brief-gen",
        "config": {
          "brand": "Nike",
          "style": "sporty"
        }
      }
    }
  ],
  "edges": []
}
```

**Réponse :**
```json
{
  "id": "workflow_123",
  "name": "Nike Campaign Template",
  "status": "DRAFT",
  "createdAt": "2025-01-15T10:30:00Z"
}
```

### **Lister les Workflows**
```http
GET /api/workflows?limit=20&offset=0&status=ACTIVE
Authorization: Bearer <access_token>
```

**Réponse :**
```json
{
  "workflows": [
    {
      "id": "workflow_123",
      "name": "Nike Campaign Template",
      "status": "ACTIVE",
      "createdAt": "2025-01-15T10:30:00Z",
      "_count": {
        "jobs": 5
      }
    }
  ],
  "total": 1,
  "limit": 20,
  "offset": 0
}
```

### **Exécuter un Workflow**
```http
POST /api/workflows/run
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "workflowId": "workflow_123",
  "inputs": {
    "brand": "Nike",
    "product": "Air Max 270",
    "objective": "Augmenter les ventes de 20%",
    "audience": "Jeunes actifs 18-35 ans",
    "budget": 50000,
    "formats": ["facebook", "instagram", "tiktok"]
  },
  "priority": "normal"
}
```

**Réponse :**
```json
{
  "jobId": "job_456",
  "status": "pending",
  "estimatedDuration": 300
}
```

## 🔄 Jobs

### **Statut d'un Job**
```http
GET /api/jobs/job_456
Authorization: Bearer <access_token>
```

**Réponse :**
```json
{
  "id": "job_456",
  "workflowId": "workflow_123",
  "status": "RUNNING",
  "progress": 65,
  "currentStep": "image-generation",
  "results": {
    "brief-generation": {
      "status": "completed",
      "data": {
        "briefs": [
          {
            "title": "Nike Air Max 270 - Émotion",
            "objective": "Augmenter les ventes de 20%",
            "audience": "Jeunes actifs 18-35 ans",
            "keyMessage": "Défiez vos limites",
            "callToAction": "Achetez maintenant"
          }
        ]
      }
    },
    "brief-evaluation": {
      "status": "completed",
      "data": {
        "winner": 0,
        "score": 8.5,
        "reasoning": "Brief très solide avec objectif clair"
      }
    }
  },
  "startedAt": "2025-01-15T10:30:00Z",
  "estimatedCompletion": "2025-01-15T10:35:00Z"
}
```

### **Lister les Jobs**
```http
GET /api/jobs?limit=20&offset=0&status=RUNNING&workflowId=workflow_123
Authorization: Bearer <access_token>
```

**Réponse :**
```json
{
  "jobs": [
    {
      "id": "job_456",
      "workflowId": "workflow_123",
      "status": "RUNNING",
      "priority": "NORMAL",
      "progress": 65,
      "workflow": {
        "id": "workflow_123",
        "name": "Nike Campaign Template"
      },
      "user": {
        "id": "user_123",
        "name": "John Doe"
      },
      "_count": {
        "assets": 3
      }
    }
  ],
  "total": 1,
  "limit": 20,
  "offset": 0
}
```

### **Annuler un Job**
```http
POST /api/jobs/job_456/cancel
Authorization: Bearer <access_token>
```

**Réponse :**
```json
{
  "success": true
}
```

### **Relancer un Job**
```http
POST /api/jobs/job_456/retry
Authorization: Bearer <access_token>
```

**Réponse :**
```json
{
  "success": true
}
```

## 📊 Assets

### **Lister les Assets**
```http
GET /api/assets?limit=20&offset=0&type=image&jobId=job_456
Authorization: Bearer <access_token>
```

**Réponse :**
```json
{
  "assets": [
    {
      "id": "asset_789",
      "type": "IMAGE",
      "name": "nike_air_max_hero.jpg",
      "url": "https://cdn.ai-ad-maker.com/assets/asset_789.jpg",
      "metadata": {
        "width": 1920,
        "height": 1080,
        "format": "jpg",
        "size": 2048576
      },
      "jobId": "job_456",
      "createdAt": "2025-01-15T10:32:00Z"
    }
  ],
  "total": 1,
  "limit": 20,
  "offset": 0
}
```

### **Télécharger un Asset**
```http
GET /api/assets/asset_789/download
Authorization: Bearer <access_token>
```

**Réponse :**
```json
{
  "url": "https://cdn.ai-ad-maker.com/assets/asset_789.jpg",
  "expiresAt": "2025-01-15T11:32:00Z"
}
```

## 🔔 Webhooks

### **Slack Events**
```http
POST /api/webhooks/slack
Content-Type: application/json

{
  "type": "event_callback",
  "event": {
    "type": "app_mention",
    "text": "Créer une campagne Nike",
    "user": "U1234567890",
    "channel": "C1234567890"
  }
}
```

### **Notion Updates**
```http
POST /api/webhooks/notion
Content-Type: application/json

{
  "object": "page",
  "entry": [
    {
      "id": "page_123",
      "object": "page"
    }
  ]
}
```

## 📈 Analytics

### **Métriques Globales**
```http
GET /api/analytics/overview
Authorization: Bearer <access_token>
```

**Réponse :**
```json
{
  "totalWorkflows": 150,
  "totalJobs": 1250,
  "successRate": 0.92,
  "averageExecutionTime": 180,
  "totalAssets": 5000,
  "costPerAsset": 2.50,
  "topAgents": [
    {
      "agent": "brief-gen",
      "usage": 450,
      "successRate": 0.95
    },
    {
      "agent": "image-artisan",
      "usage": 380,
      "successRate": 0.88
    }
  ]
}
```

### **Métriques par Période**
```http
GET /api/analytics/metrics?period=7d&granularity=1d
Authorization: Bearer <access_token>
```

**Réponse :**
```json
{
  "period": "7d",
  "granularity": "1d",
  "data": [
    {
      "date": "2025-01-15",
      "jobs": 45,
      "successRate": 0.93,
      "averageTime": 175,
      "cost": 125.50
    },
    {
      "date": "2025-01-16",
      "jobs": 52,
      "successRate": 0.96,
      "averageTime": 168,
      "cost": 142.30
    }
  ]
}
```

## 🛠️ Agents

### **Lister les Agents**
```http
GET /api/agents
Authorization: Bearer <access_token>
```

**Réponse :**
```json
{
  "agents": [
    {
      "id": "brief-gen",
      "name": "Brief Generator",
      "description": "Génère des briefs créatifs complets",
      "status": "active",
      "usage": 450,
      "successRate": 0.95
    },
    {
      "id": "image-artisan",
      "name": "Image Artisan",
      "description": "Génère images de référence et variantes",
      "status": "active",
      "usage": 380,
      "successRate": 0.88
    }
  ]
}
```

### **Statut d'un Agent**
```http
GET /api/agents/brief-gen/status
Authorization: Bearer <access_token>
```

**Réponse :**
```json
{
  "agent": "brief-gen",
  "status": "active",
  "queue": 3,
  "processing": 1,
  "lastActivity": "2025-01-15T10:30:00Z",
  "metrics": {
    "totalExecutions": 450,
    "successRate": 0.95,
    "averageTime": 30,
    "errorRate": 0.05
  }
}
```

## 🔧 Configuration

### **Paramètres Système**
```http
GET /api/config
Authorization: Bearer <access_token>
```

**Réponse :**
```json
{
  "maxWorkflows": 100,
  "maxJobsPerWorkflow": 50,
  "maxAssetsPerJob": 100,
  "rateLimits": {
    "workflows": 10,
    "jobs": 50,
    "assets": 200
  },
  "supportedFormats": [
    "facebook",
    "instagram",
    "youtube",
    "tiktok",
    "twitter"
  ],
  "supportedAgents": [
    "brief-gen",
    "brief-judge",
    "prompt-smith",
    "image-artisan",
    "animator",
    "editor",
    "music-gen",
    "voice-gen",
    "spec-check",
    "compliance"
  ]
}
```

### **Mise à Jour des Paramètres**
```http
PUT /api/config
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "maxWorkflows": 150,
  "rateLimits": {
    "workflows": 15,
    "jobs": 75,
    "assets": 300
  }
}
```

## 🚨 Gestion d'Erreurs

### **Codes d'Erreur**

| Code | Description |
|------|-------------|
| 400 | Bad Request - Données invalides |
| 401 | Unauthorized - Token invalide |
| 403 | Forbidden - Permissions insuffisantes |
| 404 | Not Found - Ressource introuvable |
| 429 | Too Many Requests - Rate limit dépassé |
| 500 | Internal Server Error - Erreur serveur |
| 503 | Service Unavailable - Service indisponible |

### **Format d'Erreur**
```json
{
  "error": "Bad Request",
  "message": "Validation failed",
  "details": [
    {
      "field": "name",
      "message": "Name is required"
    }
  ],
  "timestamp": "2025-01-15T10:30:00Z",
  "requestId": "req_123"
}
```

## 📝 Exemples d'Utilisation

### **Créer et Exécuter une Campagne Complète**

```bash
# 1. Créer un workflow
curl -X POST https://api.ai-ad-maker.com/api/workflows/create \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nike Air Max Campaign",
    "nodes": [
      {
        "id": "brief-gen",
        "type": "agent",
        "data": { "agentType": "brief-gen" }
      },
      {
        "id": "image-artisan",
        "type": "agent",
        "data": { "agentType": "image-artisan" }
      }
    ],
    "edges": [
      {
        "id": "brief-to-image",
        "source": "brief-gen",
        "target": "image-artisan"
      }
    ]
  }'

# 2. Exécuter le workflow
curl -X POST https://api.ai-ad-maker.com/api/workflows/run \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "workflowId": "workflow_123",
    "inputs": {
      "brand": "Nike",
      "product": "Air Max 270",
      "objective": "Augmenter les ventes de 20%"
    }
  }'

# 3. Suivre le progrès
curl -X GET https://api.ai-ad-maker.com/api/jobs/job_456 \
  -H "Authorization: Bearer <token>"

# 4. Récupérer les assets
curl -X GET https://api.ai-ad-maker.com/api/assets?jobId=job_456 \
  -H "Authorization: Bearer <token>"
```

## 🔗 SDKs et Bibliothèques

### **JavaScript/TypeScript**
```bash
npm install @ai-ad-maker/sdk
```

```typescript
import { AIAdMakerClient } from '@ai-ad-maker/sdk'

const client = new AIAdMakerClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.ai-ad-maker.com'
})

// Créer un workflow
const workflow = await client.workflows.create({
  name: 'My Campaign',
  nodes: [...],
  edges: [...]
})

// Exécuter le workflow
const job = await client.workflows.run(workflow.id, {
  brand: 'Nike',
  product: 'Air Max 270'
})

// Suivre le progrès
const status = await client.jobs.get(job.id)
```

### **Python**
```bash
pip install ai-ad-maker
```

```python
from ai_ad_maker import AIAdMakerClient

client = AIAdMakerClient(
    api_key='your-api-key',
    base_url='https://api.ai-ad-maker.com'
)

# Créer un workflow
workflow = client.workflows.create({
    'name': 'My Campaign',
    'nodes': [...],
    'edges': [...]
})

# Exécuter le workflow
job = client.workflows.run(workflow['id'], {
    'brand': 'Nike',
    'product': 'Air Max 270'
})
```

---

**📚 Cette documentation couvre tous les endpoints de l'API AI Ad Maker. Pour plus d'exemples et de cas d'usage, consultez notre [guide d'utilisation](https://docs.ai-ad-maker.com/guide).**
