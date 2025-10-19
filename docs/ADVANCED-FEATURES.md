# 🚀 Fonctionnalités Avancées AI Ad Maker

## 🎯 Évaluations Créatives Automatiques

### **SpecCheck Enrichi**

Le système d'évaluation créative automatique analyse chaque asset généré selon des critères stricts de qualité et de conformité.

#### **Métriques Analysées**

1. **Lisibilité (OCR)**
   - Densité de texte (max 30% de l'image)
   - Contraste (ratio > 4.5:1)
   - Taille de police (min 12px)
   - Espacement approprié

2. **Conformité Marque**
   - Placement logo (coin supérieur droit)
   - Visibilité logo (min 80% de détection)
   - Respect palette couleurs
   - Typographie conforme

3. **Conformité Plateforme**
   - Dimensions exactes requises
   - Ratio d'aspect correct
   - Taille fichier optimale
   - Durée appropriée (vidéos)

4. **Authenticité**
   - Watermark SynthID présent
   - Provenance C2PA vérifiée
   - Intégrité du fichier
   - Traçabilité complète

#### **Seuils de Blocage**

```typescript
const thresholds = {
  overallScore: 6.0,        // Score global minimum
  readability: 5.0,         // Lisibilité minimum
  authenticity: 7.0,        // Authenticité minimum
  contrastRatio: 4.5,       // Ratio de contraste
  textDensity: 30.0,        // Densité de texte max
  logoVisibility: 80.0,     // Visibilité logo min
  synthIDConfidence: 0.8,   // Confiance SynthID
}
```

#### **API Endpoints**

```bash
# Évaluer un asset
POST /api/creative-evaluation/evaluate
{
  "assetUrl": "https://cdn.ai-ad-maker.com/image.jpg",
  "assetType": "image",
  "platform": "facebook",
  "metadata": {
    "width": 1920,
    "height": 1080,
    "size": 2048576,
    "format": "jpg"
  }
}

# Évaluation en lot
POST /api/creative-evaluation/evaluate/batch
{
  "assets": [...],
  "jobId": "job_123",
  "userId": "user_456"
}
```

## 🔄 Arbitre Multi-Vendors Temps Réel

### **MediaVendor Router**

Le routeur intelligent sélectionne automatiquement le meilleur vendor selon les SLA, coûts, quotas et disponibilité.

#### **Vendors Supportés**

| Vendor | Type | Priorité | Coût/Req | SLA | Capabilities |
|--------|------|----------|----------|-----|--------------|
| Seedream 4.0 | Image | 9 | $0.05 | 30s | text-to-image, 4k, text-rendering |
| Gemini Imagen | Image | 8 | $0.03 | 25s | text-to-image, synthid, watermark |
| Veo 3.1 | Video | 9 | $0.15 | 60s | text-to-video, audio-native |
| Seedance Pro | Video | 8 | $0.12 | 45s | text-to-video, 1080p |
| Kling 2.5 | Video | 7 | $0.08 | 40s | text-to-video, fast |
| FAL Seedream | Image | 6 | $0.04 | 35s | text-to-image, image-editing |

#### **Algorithme de Sélection**

```typescript
const score = {
  priority: vendor.priority * 10,           // 10-100
  cost: calculateCostScore(vendor, request), // 0-100
  latency: calculateLatencyScore(vendor),    // 0-100
  reliability: vendor.sla.successRate * 100, // 0-100
  availability: getCurrentAvailability(),    // 0-100
  quality: getQualityScore(request),         // 0-100
}

const totalScore = Object.values(score).reduce((sum, s) => sum + s, 0) / 6
```

#### **Fallback Automatique**

```typescript
const fallbackStrategy = {
  primary: 'seedream-4.0',
  fallbacks: ['gemini-imagen', 'fal-seedream'],
  maxRetries: 3,
  retryDelay: 5000, // ms
}
```

#### **API Endpoints**

```bash
# Router une requête
POST /api/vendor-router/route
{
  "type": "image",
  "task": "Generate hero image for Nike campaign",
  "requirements": {
    "quality": "high",
    "format": "facebook",
    "resolution": "1920x1080"
  },
  "constraints": {
    "maxCost": 0.10,
    "maxLatency": 30000,
    "requiredCapabilities": ["text-rendering", "4k"]
  }
}

# Statut des vendors
GET /api/vendor-router/status
```

## 🧠 Mémoire de Marque Opérante

### **Brand Brain (RAG + Notion)**

Le système de mémoire de marque ingère les chartes, claims interdits, DO/DON'T, palettes et transforme cela en contraintes de prompt opérationnelles.

#### **Sources de Données**

1. **Notion (Source de Vérité)**
   - Chartes graphiques
   - Guidelines de marque
   - Claims autorisés/interdits
   - Exemples de campagnes

2. **Vector Store (Pinecone)**
   - Recherche sémantique
   - Exemples similaires
   - Patterns de succès
   - Apprentissage continu

#### **Contraintes Générées**

```typescript
const constraints = {
  logoConstraints: "Logo Nike obligatoire en coin supérieur droit, taille min 120px",
  colorConstraints: "Utiliser uniquement #FF0000, #FFFFFF, éviter #000000",
  typographyConstraints: "Police Helvetica pour titres, Arial pour texte",
  toneConstraints: "Ton énergique, éviter le ton passif",
  claimConstraints: "Claims autorisés: 'Just Do It', interdits: 'Meilleur que'",
  dos: ["Utiliser le logo officiel", "Respecter la palette"],
  donts: ["Modifier le logo", "Utiliser des couleurs interdites"],
  examples: ["Référence campagne 2024", "Style Nike Air Max"],
}
```

#### **Validation de Prompt**

```typescript
const validation = await brandBrain.validatePromptAgainstBrand(brandId, prompt)

// Résultat
{
  isValid: false,
  score: 7.5,
  violations: ["Couleur interdite: #000000", "Ton passif détecté"],
  suggestions: ["Utiliser #FF0000", "Ton énergique requis"]
}
```

#### **API Endpoints**

```bash
# Charger les guidelines
POST /api/brand-brain/guidelines/load
{
  "brandId": "nike"
}

# Générer les contraintes
POST /api/brand-brain/constraints/generate
{
  "brandId": "nike",
  "context": {
    "product": "Air Max 270",
    "objective": "Augmenter les ventes",
    "audience": "Jeunes actifs",
    "platform": "facebook"
  }
}

# Valider un prompt
POST /api/brand-brain/prompt/validate
{
  "brandId": "nike",
  "prompt": "Créer une image avec le logo Nike en noir..."
}
```

## 🔧 Configuration Avancée

### **Variables d'Environnement**

```env
# Creative Evaluation
OCR_API_KEY="..."
CONTRAST_ANALYSIS_ENABLED="true"
SYNTHID_VERIFICATION_ENABLED="true"
C2PA_VERIFICATION_ENABLED="true"

# Vendor Router
VENDOR_ROUTER_ENABLED="true"
FALLBACK_STRATEGY="auto"
COST_OPTIMIZATION="true"
SLA_MONITORING="true"

# Brand Brain
PINECONE_API_KEY="..."
PINECONE_INDEX_NAME="ai-ad-maker"
BRAND_GUIDELINES_SYNC="true"
VECTOR_SEARCH_ENABLED="true"

# Seuils de Qualité
READABILITY_MIN_SCORE="6.0"
CONTRAST_MIN_RATIO="4.5"
TEXT_DENSITY_MAX="30.0"
LOGO_VISIBILITY_MIN="80.0"
SYNTHID_CONFIDENCE_MIN="0.8"
C2PA_INTEGRITY_REQUIRED="true"

# Configuration Router
VENDOR_PRIORITY_WEIGHT="0.3"
COST_WEIGHT="0.25"
LATENCY_WEIGHT="0.2"
RELIABILITY_WEIGHT="0.15"
AVAILABILITY_WEIGHT="0.1"
```

### **Monitoring et Métriques**

#### **Creative Evaluation Metrics**

```typescript
const metrics = {
  totalEvaluations: 1250,
  averageScore: 8.2,
  successRate: 0.92,
  humanApprovalRate: 0.15,
  topIssues: [
    { issue: 'Contraste insuffisant', count: 45 },
    { issue: 'Texte trop petit', count: 32 },
    { issue: 'Logo mal placé', count: 28 },
  ],
  platformBreakdown: {
    facebook: { count: 450, averageScore: 8.5 },
    instagram: { count: 380, averageScore: 8.1 },
    tiktok: { count: 420, averageScore: 7.9 },
  },
}
```

#### **Vendor Router Metrics**

```typescript
const vendorMetrics = {
  totalRequests: 5000,
  averageLatency: 25000,
  averageCost: 0.08,
  successRate: 0.94,
  fallbackRate: 0.12,
  topVendors: [
    { vendor: 'seedream-4.0', usage: 45, successRate: 0.96 },
    { vendor: 'gemini-imagen', usage: 30, successRate: 0.92 },
    { vendor: 'veo-3.1', usage: 25, successRate: 0.90 },
  ],
}
```

#### **Brand Brain Metrics**

```typescript
const brandMetrics = {
  totalBrands: 25,
  activeBrands: 20,
  averageGuidelines: 8.5,
  topBrands: [
    { brandId: 'nike', name: 'Nike', usage: 450 },
    { brandId: 'adidas', name: 'Adidas', usage: 380 },
    { brandId: 'apple', name: 'Apple', usage: 320 },
  ],
  guidelinesBreakdown: {
    logo: 20,
    colors: 20,
    typography: 18,
    tone: 15,
    claims: 12,
  },
}
```

## 🚀 Utilisation Avancée

### **Workflow Complet avec Nouvelles Fonctionnalités**

```typescript
// 1. Charger les guidelines de marque
await brandBrain.loadBrandGuidelines('nike')

// 2. Générer les contraintes de prompt
const constraints = await brandBrain.generatePromptConstraints('nike', {
  product: 'Air Max 270',
  objective: 'Augmenter les ventes',
  audience: 'Jeunes actifs',
  platform: 'facebook'
})

// 3. Router vers le meilleur vendor
const routing = await vendorRouter.routeRequest({
  type: 'image',
  task: 'Generate hero image',
  requirements: { quality: 'high', format: 'facebook' },
  constraints: { maxCost: 0.10, maxLatency: 30000 }
})

// 4. Exécuter la génération
const result = await vendorRouter.executeRequest(routing, request)

// 5. Évaluer la qualité créative
const evaluation = await creativeEvaluator.evaluateAsset({
  url: result.url,
  type: 'image',
  platform: 'facebook',
  metadata: result.metadata
})

// 6. Déclencher HITL si nécessaire
if (evaluation.requiresHumanApproval) {
  await triggerHumanApproval(evaluation)
}
```

### **Intégration avec Slack/Notion**

```typescript
// Notification Slack pour HITL
const slackMessage = {
  text: `🎨 Évaluation créative requise`,
  blocks: [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Asset:* ${assetUrl}\n*Score:* ${evaluation.overallScore}/10\n*Issues:* ${evaluation.blockingIssues.join(', ')}`
      }
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: { type: "plain_text", text: "✅ Approuver" },
          action_id: "approve_asset",
          value: assetId
        },
        {
          type: "button",
          text: { type: "plain_text", text: "❌ Rejeter" },
          action_id: "reject_asset",
          value: assetId
        }
      ]
    }
  ]
}
```

---

**🎯 Ces fonctionnalités avancées transforment AI Ad Maker en une plateforme de niveau entreprise, capable de gérer la complexité des campagnes marketing à grande échelle avec une qualité et une conformité maximales.**
