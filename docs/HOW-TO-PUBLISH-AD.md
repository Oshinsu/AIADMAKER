# 📢 Guide : Comment Publier une Publicité avec AI Ad Maker

Ce guide vous accompagne étape par étape pour créer et publier une publicité complète en utilisant notre plateforme d'agents IA.

## 🎯 Étape 1 : Préparation du Brief

### Via Slack (Recommandé)

```bash
# Commande Slack
/brief

# Puis remplir le formulaire :
Brand: Nike
Product: Air Max 270
Objective: Augmenter les ventes de 20% ce trimestre
Audience: Jeunes actifs 18-35 ans, passionnés de sport
Budget: 50000€
Timeline: 2 semaines
Formats: Facebook, Instagram, TikTok
```

### Via Interface Web

1. **Connectez-vous** à l'interface web
2. **Créez un nouveau workflow** depuis le canvas
3. **Glissez-déposez** l'agent "Brief Generator"
4. **Configurez** les paramètres :
   - Marque : Nike
   - Produit : Air Max 270
   - Objectif : Augmenter les ventes de 20%
   - Audience : Jeunes actifs 18-35 ans
   - Budget : 50000€
   - Contraintes : Pas d'alcool, respect des couleurs Nike
   - Formats : Facebook (16:9), Instagram (1:1), TikTok (9:16)

## 🤖 Étape 2 : Génération Automatique

### Brief Generation (30 secondes)
L'agent **Brief Generator** va créer 3 briefs distincts :

1. **Approche Émotionnelle** : Focus sur l'émotion et la connexion
2. **Approche Rationnelle** : Focus sur les bénéfices et preuves  
3. **Approche Créative** : Concept innovant et disruptif

### Brief Evaluation (15 secondes)
L'agent **Brief Judge** va :
- Évaluer chaque brief sur 7 critères (0-10)
- Sélectionner le meilleur brief
- Fournir des recommandations d'amélioration

### Prompt Optimization (20 secondes)
L'agent **Prompt Smith** va :
- Optimiser les prompts pour chaque générateur
- Adapter le style selon la plateforme
- Créer des variations pour A/B testing

## 🎨 Étape 3 : Génération des Médias

### Images (2 minutes)
L'agent **Image Artisan** va générer :

**Images de Référence :**
- Hero image (produit principal)
- Lifestyle shots (personnes utilisant le produit)
- Packshots (produit isolé)

**Variations par Plateforme :**
- Facebook : 16:9, 1920x1080
- Instagram : 1:1, 1080x1080
- TikTok : 9:16, 1080x1920

**Modèles Utilisés :**
- Seedream 4.0 (priorité rendu texte)
- Gemini Imagen 4 (watermark SynthID)

### Vidéos (3 minutes)
L'agent **Animator** va créer :

**Types de Vidéos :**
- Text-to-video (à partir des prompts)
- Image-to-video (animation des images)
- Montage final avec transitions

**Modèles Utilisés :**
- Veo 3.1 (audio natif, 8-10s)
- Seedance Pro (1080p, T2V/I2V)
- Kling 2.5 (animation rapide)

### Audio (1.5 minutes)
L'agent **Music Generator** va créer :

**Musique :**
- Style : Upbeat, énergique
- Durée : 15-30 secondes
- Format : MP3, 128kbps

**Voix Off :**
- Texte : "Découvrez la nouvelle Air Max 270"
- Voix : Masculine, énergique
- Langues : Français, Anglais

## ✂️ Étape 4 : Montage et Finalisation

### Video Editing (1 minute)
L'agent **Editor** va :
- Assembler les séquences vidéo
- Synchroniser l'audio
- Ajouter les titres et packshots
- Créer les cuts 6s, 10s, 15s, 20s

### Spec Validation (15 secondes)
L'agent **Spec Check** va vérifier :
- Poids des fichiers (Facebook < 4GB)
- Durée (TikTok < 3min)
- Résolution (YouTube 1080p)
- Bitrate (Instagram optimisé)

### Compliance Check (30 secondes)
L'agent **Compliance** va vérifier :
- Droits d'images (SynthID watermark)
- Conformité légale (pas d'alcool)
- Respect des guidelines de marque
- Claims publicitaires vérifiés

## 👥 Étape 5 : Validation Humaine

### Notification Slack
```
🤖 AI Ad Maker
Votre publicité Nike Air Max 270 est prête !

📊 Résumé :
• 3 briefs générés → Brief #2 sélectionné (Score: 8.5/10)
• 12 images créées (4 formats × 3 variations)
• 6 vidéos animées (3 durées × 2 styles)
• 2 pistes audio (musique + voix off)

🎯 Formats prêts :
• Facebook : 16:9, 1920x1080
• Instagram : 1:1, 1080x1080  
• TikTok : 9:16, 1080x1920

✅ Actions :
[Approuver] [Modifier] [Rejeter]
```

### Processus d'Approbation

1. **Révision** des assets générés
2. **Feedback** via Slack ou interface web
3. **Modifications** si nécessaire (re-génération)
4. **Approbation finale** pour publication

## 📤 Étape 6 : Export et Publication

### Export Automatique
L'agent **Export Worker** va créer :

**Pack Facebook :**
- Vidéo : 16:9, 1920x1080, max 4GB
- Image : 16:9, 1920x1080, JPG
- Audio : MP3, 128kbps

**Pack Instagram :**
- Post : 1:1, 1080x1080, max 100MB
- Story : 9:16, 1080x1920, max 100MB
- Reel : 9:16, 1080x1920, max 100MB

**Pack TikTok :**
- Vidéo : 9:16, 1080x1920, max 3min
- Audio : MP3, 128kbps

### Livraison
```
📦 Pack de Livraison Nike Air Max 270

📁 Assets :
• images/hero_facebook_1920x1080.jpg
• images/lifestyle_instagram_1080x1080.jpg
• videos/animation_tiktok_1080x1920.mp4
• audio/music_upbeat_30s.mp3
• audio/voice_french_15s.mp3

📋 Manifest :
• formats.json (spécifications techniques)
• metadata.json (prompts, modèles, versions)
• compliance.json (vérifications légales)

🔗 Liens de Téléchargement :
• S3 Bucket : https://ai-ad-maker-assets.s3.amazonaws.com/
• CDN : https://cdn.ai-ad-maker.com/
• Notion : https://notion.so/brief-nike-air-max-270
```

## 🎛️ Commandes Avancées

### Workflow Personnalisé

```bash
# Créer un workflow custom
curl -X POST http://localhost:3001/api/workflows/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nike Campaign Template",
    "description": "Template pour campagnes Nike",
    "nodes": [
      {
        "id": "brief-gen",
        "type": "agent",
        "config": {
          "brand": "Nike",
          "style": "sporty"
        }
      }
    ],
    "edges": []
  }'
```

### Monitoring en Temps Réel

```bash
# Suivre l'exécution
curl http://localhost:3001/api/jobs/job_123

# Réponse :
{
  "id": "job_123",
  "status": "running",
  "progress": 65,
  "currentStep": "image-generation",
  "results": {
    "brief-generation": {
      "status": "completed",
      "data": { "briefs": [...] }
    },
    "brief-evaluation": {
      "status": "completed", 
      "data": { "winner": 1, "score": 8.5 }
    }
  }
}
```

## 🔧 Personnalisation

### Agents Personnalisés

```typescript
// Créer un agent custom
class CustomAgent {
  async process(input: any) {
    // Votre logique personnalisée
    return { result: 'custom output' }
  }
}

// L'enregistrer dans l'orchestrateur
orchestrator.registerAgent('custom-agent', new CustomAgent())
```

### Templates de Workflow

```json
{
  "name": "E-commerce Template",
  "nodes": [
    {
      "id": "brief-gen",
      "type": "agent",
      "config": {
        "template": "ecommerce",
        "focus": "conversion"
      }
    }
  ]
}
```

## 📊 Analytics et Optimisation

### Métriques de Performance

- **Taux de Conversion** : % de briefs → publicités finales
- **Temps d'Exécution** : Durée moyenne par étape
- **Coût par Asset** : Coût de génération par média
- **Score de Qualité** : Évaluation automatique

### A/B Testing

```bash
# Tester différentes approches
/ads test Nike Air Max - approach:emotional
/ads test Nike Air Max - approach:rational
/ads test Nike Air Max - approach:creative

# Comparer les résultats
/ads compare test_123 test_124 test_125
```

## 🚨 Dépannage

### Problèmes Courants

**Erreur : "Agent timeout"**
```bash
# Solution : Augmenter le timeout
curl -X POST http://localhost:3001/api/workflows/run \
  -d '{"workflowId": "123", "timeout": 300}'
```

**Erreur : "API quota exceeded"**
```bash
# Solution : Vérifier les quotas
curl http://localhost:3001/api/status/quotas
```

**Erreur : "Asset generation failed"**
```bash
# Solution : Vérifier les logs
curl http://localhost:3001/api/jobs/job_123/logs
```

### Support

- **Slack** : #ai-ad-maker-support
- **Email** : support@ai-ad-maker.com
- **Documentation** : https://docs.ai-ad-maker.com
- **GitHub** : https://github.com/ai-ad-maker/issues

---

**🎉 Félicitations ! Vous savez maintenant comment publier une publicité avec AI Ad Maker.**

*Pour plus d'aide, consultez notre [documentation complète](https://docs.ai-ad-maker.com) ou contactez notre équipe support.*
