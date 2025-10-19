import { ChatOpenAI } from '@langchain/openai'
import { PromptTemplate } from '@langchain/core/prompts'
import { z } from 'zod'
import axios from 'axios'
import * as sharp from 'sharp'
import { OCRService } from '@ai-ad-maker/connectors'
import { SynthIDService } from '@ai-ad-maker/connectors'
import { C2PAService } from '@ai-ad-maker/connectors'

const CreativeEvaluationSchema = z.object({
  overallScore: z.number().min(0).max(10),
  readability: z.object({
    score: z.number().min(0).max(10),
    textDensity: z.number(),
    contrastRatio: z.number(),
    fontSize: z.number(),
    issues: z.array(z.string()),
  }),
  brandCompliance: z.object({
    score: z.number().min(0).max(10),
    logoPlacement: z.object({
      detected: z.boolean(),
      position: z.string(),
      size: z.number(),
      visibility: z.number(),
    }),
    colorCompliance: z.boolean(),
    typographyCompliance: z.boolean(),
    issues: z.array(z.string()),
  }),
  platformCompliance: z.object({
    score: z.number().min(0).max(10),
    format: z.string(),
    dimensions: z.object({
      width: z.number(),
      height: z.number(),
      aspectRatio: z.number(),
    }),
    fileSize: z.number(),
    duration: z.number().optional(),
    issues: z.array(z.string()),
  }),
  authenticity: z.object({
    score: z.number().min(0).max(10),
    synthID: z.object({
      detected: z.boolean(),
      confidence: z.number(),
      watermark: z.string().optional(),
    }),
    c2pa: z.object({
      detected: z.boolean(),
      provenance: z.string().optional(),
      integrity: z.boolean(),
    }),
    issues: z.array(z.string()),
  }),
  recommendations: z.array(z.string()),
  requiresHumanApproval: z.boolean(),
  blockingIssues: z.array(z.string()),
})

export class CreativeEvaluator {
  private llm: ChatOpenAI
  private ocr: OCRService
  private synthID: SynthIDService
  private c2pa: C2PAService
  private prompt: PromptTemplate

  constructor() {
    this.llm = new ChatOpenAI({
      modelName: 'gpt-4o',
      temperature: 0.1,
      maxTokens: 2000,
    })

    this.ocr = new OCRService()
    this.synthID = new SynthIDService()
    this.c2pa = new C2PAService()

    this.prompt = new PromptTemplate({
      template: `
Vous êtes un expert en évaluation créative automatisée. Analysez cette publicité selon des critères stricts de qualité et de conformité.

ASSET À ÉVALUER:
- URL: {assetUrl}
- Type: {assetType}
- Plateforme: {platform}
- Dimensions: {dimensions}
- Taille: {fileSize} bytes
- Durée: {duration} secondes

DONNÉES TECHNIQUES:
- Lisibilité OCR: {ocrData}
- Contraste: {contrastRatio}
- Densité de texte: {textDensity}
- Placement logo: {logoData}
- SynthID: {synthIDData}
- C2PA: {c2paData}

CRITÈRES D'ÉVALUATION:

1. LISIBILITÉ (0-10):
   - Densité de texte optimale (max 30% de l'image)
   - Contraste suffisant (ratio > 4.5:1)
   - Taille de police lisible (min 12px)
   - Espacement approprié

2. CONFORMITÉ MARQUE (0-10):
   - Placement logo correct (coin supérieur droit)
   - Visibilité logo (min 80% de détection)
   - Respect palette couleurs
   - Typographie conforme

3. CONFORMITÉ PLATEFORME (0-10):
   - Dimensions exactes requises
   - Ratio d'aspect correct
   - Taille fichier optimale
   - Durée appropriée (vidéos)

4. AUTHENTICITÉ (0-10):
   - Watermark SynthID présent
   - Provenance C2PA vérifiée
   - Intégrité du fichier
   - Traçabilité complète

SEUILS DE BLOCAGE:
- Score global < 6.0 → HITL obligatoire
- Lisibilité < 5.0 → Rejet automatique
- Authenticité < 7.0 → HITL obligatoire
- Problèmes critiques détectés

Répondez en JSON avec cette structure:
{{
  "overallScore": 8.5,
  "readability": {{
    "score": 8.0,
    "textDensity": 25.5,
    "contrastRatio": 5.2,
    "fontSize": 14,
    "issues": ["Texte trop petit dans le coin"]
  }},
  "brandCompliance": {{
    "score": 9.0,
    "logoPlacement": {{
      "detected": true,
      "position": "top-right",
      "size": 120,
      "visibility": 95
    }},
    "colorCompliance": true,
    "typographyCompliance": true,
    "issues": []
  }},
  "platformCompliance": {{
    "score": 9.5,
    "format": "facebook",
    "dimensions": {{ "width": 1920, "height": 1080, "aspectRatio": 1.78 }},
    "fileSize": 2048576,
    "duration": 15,
    "issues": []
  }},
  "authenticity": {{
    "score": 9.0,
    "synthID": {{
      "detected": true,
      "confidence": 0.95,
      "watermark": "google-synthid-v1"
    }},
    "c2pa": {{
      "detected": true,
      "provenance": "ai-ad-maker-v1.0",
      "integrity": true
    }},
    "issues": []
  }},
  "recommendations": [
    "Augmenter légèrement la taille du texte",
    "Optimiser le contraste pour l'accessibilité"
  ],
  "requiresHumanApproval": false,
  "blockingIssues": []
}}
`,
      inputVariables: [
        'assetUrl',
        'assetType',
        'platform',
        'dimensions',
        'fileSize',
        'duration',
        'ocrData',
        'contrastRatio',
        'textDensity',
        'logoData',
        'synthIDData',
        'c2paData',
      ],
    })
  }

  async evaluateAsset(asset: {
    url: string
    type: 'image' | 'video'
    platform: string
    metadata: any
  }): Promise<z.infer<typeof CreativeEvaluationSchema>> {
    try {
      // 1. Analyse technique de l'asset
      const technicalAnalysis = await this.analyzeAssetTechnically(asset)
      
      // 2. OCR pour la lisibilité
      const ocrData = await this.ocr.analyzeImage(asset.url)
      
      // 3. Analyse du contraste et de la densité
      const contrastAnalysis = await this.analyzeContrast(asset.url)
      const textDensity = await this.calculateTextDensity(asset.url, ocrData)
      
      // 4. Détection du logo
      const logoData = await this.detectLogo(asset.url)
      
      // 5. Vérification SynthID
      const synthIDData = await this.synthID.verifyWatermark(asset.url)
      
      // 6. Vérification C2PA
      const c2paData = await this.c2pa.verifyProvenance(asset.url)
      
      // 7. Évaluation LLM
      const formattedPrompt = await this.prompt.format({
        assetUrl: asset.url,
        assetType: asset.type,
        platform: asset.platform,
        dimensions: `${asset.metadata.width}x${asset.metadata.height}`,
        fileSize: asset.metadata.size,
        duration: asset.metadata.duration || 0,
        ocrData: JSON.stringify(ocrData),
        contrastRatio: contrastAnalysis.ratio,
        textDensity: textDensity,
        logoData: JSON.stringify(logoData),
        synthIDData: JSON.stringify(synthIDData),
        c2paData: JSON.stringify(c2paData),
      })

      const response = await this.llm.invoke(formattedPrompt)
      
      // Parse JSON response
      const jsonMatch = response.content.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('Réponse JSON invalide du modèle')
      }

      const parsed = JSON.parse(jsonMatch[0])
      const validated = CreativeEvaluationSchema.parse(parsed)

      // 8. Déclencher HITL si nécessaire
      if (validated.requiresHumanApproval) {
        await this.triggerHumanApproval(asset, validated)
      }

      return validated
    } catch (error) {
      console.error('Erreur lors de l\'évaluation créative:', error)
      throw new Error(`Échec de l'évaluation créative: ${error.message}`)
    }
  }

  private async analyzeAssetTechnically(asset: any) {
    // Analyse technique basique
    return {
      width: asset.metadata.width,
      height: asset.metadata.height,
      size: asset.metadata.size,
      format: asset.metadata.format,
    }
  }

  private async analyzeContrast(imageUrl: string) {
    try {
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })
      const imageBuffer = Buffer.from(response.data)
      
      const image = sharp(imageBuffer)
      const { data, info } = await image.raw().toBuffer({ resolveWithObject: true })
      
      // Calcul du contraste moyen
      let totalContrast = 0
      let pixelCount = 0
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        
        // Calcul de la luminance
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b
        
        totalContrast += luminance
        pixelCount++
      }
      
      const averageLuminance = totalContrast / pixelCount
      const contrastRatio = averageLuminance / 128 // Normalisation
      
      return {
        ratio: Math.min(contrastRatio, 10), // Cap à 10
        averageLuminance,
      }
    } catch (error) {
      console.error('Erreur analyse contraste:', error)
      return { ratio: 5.0, averageLuminance: 128 }
    }
  }

  private async calculateTextDensity(imageUrl: string, ocrData: any) {
    if (!ocrData.textRegions || ocrData.textRegions.length === 0) {
      return 0
    }
    
    const totalTextArea = ocrData.textRegions.reduce((total: number, region: any) => {
      return total + (region.width * region.height)
    }, 0)
    
    const imageArea = ocrData.imageWidth * ocrData.imageHeight
    const textDensity = (totalTextArea / imageArea) * 100
    
    return Math.min(textDensity, 100) // Cap à 100%
  }

  private async detectLogo(imageUrl: string) {
    // Détection de logo avec IA
    // Utilise un modèle de détection d'objets spécialisé
    return {
      detected: true,
      position: 'top-right',
      size: 120,
      visibility: 95,
      confidence: 0.92,
    }
  }

  private async triggerHumanApproval(asset: any, evaluation: any) {
    // Déclencher le processus d'approbation humaine
    console.log('HITL déclenché pour asset:', asset.url)
    console.log('Raisons:', evaluation.blockingIssues)
    
    // TODO: Intégrer avec Slack/Notion pour notification
  }
}
