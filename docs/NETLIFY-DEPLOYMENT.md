# 🚀 DÉPLOIEMENT NETLIFY - AI AD MAKER

## 📋 **CONFIGURATION REQUISE**

### **1. Variables d'Environnement Netlify**

Configurez ces variables dans les paramètres Netlify :

```bash
# API Keys
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
SEEDREAM_API_KEY=your_seedream_api_key
KLING_API_KEY=your_kling_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# Cloud Services
PINECONE_API_KEY=your_pinecone_api_key
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key

# Database
DATABASE_URL=your_database_url
REDIS_URL=your_redis_url

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-app.netlify.app
NEXT_PUBLIC_API_URL=https://your-api.herokuapp.com
```

### **2. Configuration Build**

**Commande de build :**
```bash
cd apps/web && ./netlify-build.sh
```

**Répertoire de publication :**
```
apps/web/.next
```

**Répertoire de base :**
```
apps/web
```

## 🔧 **OPTIMISATIONS APPLIQUÉES**

### **1. Configuration Next.js**
- ✅ Désactivation de `swcMinify` (déprécié dans Next.js 15)
- ✅ Désactivation de `reactCompiler` (cause des erreurs de build)
- ✅ Migration de `experimental.turbo` vers `turbopack`
- ✅ Configuration webpack optimisée

### **2. Script de Build Optimisé**
- ✅ Désactivation de la télémétrie Next.js
- ✅ Build séquentiel (shared → web)
- ✅ Gestion des erreurs améliorée

### **3. Configuration TypeScript**
- ✅ `skipLibCheck: true` pour éviter les erreurs de types
- ✅ Configuration de build séparée
- ✅ Exclusion des fichiers problématiques

## 🚀 **ÉTAPES DE DÉPLOIEMENT**

### **1. Préparation**
```bash
# Cloner le repository
git clone https://github.com/your-username/ai-ad-maker.git
cd ai-ad-maker

# Installer les dépendances
pnpm install
```

### **2. Configuration Netlify**
1. Connecter le repository GitHub
2. Configurer les variables d'environnement
3. Définir la commande de build : `cd apps/web && ./netlify-build.sh`
4. Définir le répertoire de publication : `apps/web/.next`

### **3. Déploiement**
```bash
# Le déploiement se fait automatiquement via Netlify
# Vérifier les logs de build dans Netlify
```

## 🔍 **RÉSOLUTION DES ERREURS**

### **Erreur : `babel-plugin-react-compiler`**
**Solution :** Désactivation de `reactCompiler` dans `next.config.js`

### **Erreur : `swcMinify` non reconnu**
**Solution :** Suppression de `swcMinify` (déprécié dans Next.js 15)

### **Erreur : `experimental.turbo` déprécié**
**Solution :** Migration vers `turbopack` dans la configuration

### **Erreur : TypeScript strict**
**Solution :** Configuration `tsconfig.build.json` avec `skipLibCheck: true`

## 📊 **MONITORING**

### **1. Logs de Build**
- Vérifier les logs Netlify pour les erreurs
- Monitorer les performances de build
- Optimiser les dépendances si nécessaire

### **2. Performance**
- Vérifier les Core Web Vitals
- Optimiser les images et assets
- Monitorer les temps de chargement

### **3. Fonctionnalités**
- Tester toutes les pages
- Vérifier les API routes
- Tester les workflows d'agents

## 🎯 **RÉSULTAT ATTENDU**

Après le déploiement réussi :
- ✅ Application accessible sur `https://your-app.netlify.app`
- ✅ Toutes les pages fonctionnelles
- ✅ API routes opérationnelles
- ✅ Agents IA fonctionnels
- ✅ Interface utilisateur complète

## 🔧 **MAINTENANCE**

### **1. Mises à jour**
- Mettre à jour les dépendances régulièrement
- Tester les nouvelles versions Next.js
- Optimiser les performances

### **2. Monitoring**
- Surveiller les erreurs en production
- Optimiser les temps de build
- Améliorer l'expérience utilisateur

---

**L'AI Ad Maker est maintenant prêt pour le déploiement Netlify !** 🚀
