import { ChatOpenAI } from '@langchain/openai'
import { PromptTemplate } from '@langchain/core/prompts'
import { z } from 'zod'
import { NotionService } from '@ai-ad-maker/connectors'
import { VectorStore } from '@ai-ad-maker/connectors'
import { logger } from '../../connectors/src/lib/logger'
import { SOTA_PROMPTS_2025 } from '../prompts/sota-prompts-2025'

const BrandGuidelinesSchema = z.object({
  brandName: z.string(),
  logo: z.object({
    primary: z.string(),
    secondary: z.string().optional(),
    placement: z.string(),
    size: z.object({
      min: z.number(),
      max: z.number(),
    }),
    clearSpace: z.number(),
  }),
  colors: z.object({
    primary: z.array(z.string()),
    secondary: z.array(z.string()),
    accent: z.array(z.string()),
    forbidden: z.array(z.string()),
  }),
  typography: z.object({
    primary: z.string(),
    secondary: z.string(),
    sizes: z.object({
      heading: z.number(),
      body: z.number(),
      caption: z.number(),
    }),
  }),
  tone: z.object({
    voice: z.string(),
    personality: z.array(z.string()),
    forbidden: z.array(z.string()),
  }),
  claims: z.object({
    allowed: z.array(z.string()),
    forbidden: z.array(z.string()),
    legal: z.array(z.string()),
  }),
  dos: z.array(z.string()),
  donts: z.array(z.string()),
  examples: z.array(z.object({
    type: z.string(),
    description: z.string(),
    url: z.string().optional(),
  })),
})

const PromptConstraintSchema = z.object({
  brandName: z.string(),
  logoConstraints: z.string(),
  colorConstraints: z.string(),
  typographyConstraints: z.string(),
  toneConstraints: z.string(),
  claimConstraints: z.string(),
  dos: z.array(z.string()),
  donts: z.array(z.string()),
  examples: z.array(z.string()),
  technicalSpecs: z.string(),
})

export class BrandBrain {
  private llm: ChatOpenAI
  private notion: NotionService
  private vectorStore: VectorStore
  private brandGuidelines: Map<string, z.infer<typeof BrandGuidelinesSchema>>
  private prompt: PromptTemplate

  constructor() {
    this.llm = new ChatOpenAI({
      modelName: 'gpt-4o',
      temperature: 0.1,
      maxTokens: 2000,
    })

    this.notion = new NotionService()
    this.vectorStore = new VectorStore()
    this.brandGuidelines = new Map()

    this.prompt = new PromptTemplate({
      template: `
Vous êtes un expert en identité de marque. Votre mission est de transformer les guidelines de marque en contraintes de prompt opérationnelles.

GUIDELINES DE MARQUE:
{guidelines}

CONTEXTE DE LA CAMPAGNE:
- Marque: {brandName}
- Produit: {product}
- Objectif: {objective}
- Audience: {audience}
- Plateforme: {platform}

TRANSFORMEZ CES GUIDELINES EN CONTRAINTES DE PROMPT:

1. LOGO:
   - Placement: {logoPlacement}
   - Taille: {logoSize}
   - Espace libre: {logoClearSpace}
   - Contraintes: {logoConstraints}

2. COULEURS:
   - Primaires: {primaryColors}
   - Secondaires: {secondaryColors}
   - Accents: {accentColors}
   - Interdites: {forbiddenColors}
   - Contraintes: {colorConstraints}

3. TYPOGRAPHIE:
   - Police principale: {primaryFont}
   - Police secondaire: {secondaryFont}
   - Tailles: {fontSizes}
   - Contraintes: {typographyConstraints}

4. TON:
   - Voix: {brandVoice}
   - Personnalité: {brandPersonality}
   - Interdits: {forbiddenTone}
   - Contraintes: {toneConstraints}

5. CLAIMS:
   - Autorisés: {allowedClaims}
   - Interdits: {forbiddenClaims}
   - Légal: {legalClaims}
   - Contraintes: {claimConstraints}

6. DO/DON'T:
   - À faire: {dos}
   - À éviter: {donts}

7. EXEMPLES:
   - Références: {examples}

GÉNÉREZ UN PROMPT CONTRAINT PAR LA MARQUE:

Répondez en JSON avec cette structure:
{{
  "brandName": "{brandName}",
  "logoConstraints": "Logo {brandName} obligatoire en coin supérieur droit, taille min 120px, espace libre 20px",
  "colorConstraints": "Utiliser uniquement {primaryColors}, éviter {forbiddenColors}, accent {accentColors}",
  "typographyConstraints": "Police {primaryFont} pour titres, {secondaryFont} pour texte, tailles {fontSizes}",
  "toneConstraints": "Ton {brandVoice}, personnalité {brandPersonality}, éviter {forbiddenTone}",
  "claimConstraints": "Claims autorisés: {allowedClaims}, interdits: {forbiddenClaims}",
  "dos": [
    "Utiliser le logo officiel",
    "Respecter la palette couleurs",
    "Ton {brandVoice}"
  ],
  "donts": [
    "Modifier le logo",
    "Utiliser {forbiddenColors}",
    "Ton {forbiddenTone}"
  ],
  "examples": [
    "Référence 1: {example1}",
    "Référence 2: {example2}"
  ],
  "technicalSpecs": "Format {platform}, résolution optimale, watermark SynthID"
}}
`,
      inputVariables: [
        'guidelines',
        'brandName',
        'product',
        'objective',
        'audience',
        'platform',
        'logoPlacement',
        'logoSize',
        'logoClearSpace',
        'logoConstraints',
        'primaryColors',
        'secondaryColors',
        'accentColors',
        'forbiddenColors',
        'colorConstraints',
        'primaryFont',
        'secondaryFont',
        'fontSizes',
        'typographyConstraints',
        'brandVoice',
        'brandPersonality',
        'forbiddenTone',
        'toneConstraints',
        'allowedClaims',
        'forbiddenClaims',
        'legalClaims',
        'claimConstraints',
        'dos',
        'donts',
        'examples',
        'example1',
        'example2',
        'technicalSpecs',
      ],
    })
  }

  async loadBrandGuidelines(brandId: string): Promise<void> {
    try {
      // 1. Charger depuis Notion
      const notionData = await this.notion.getBrandGuidelines(brandId)
      
      // 2. Charger depuis Vector Store
      const vectorData = await this.vectorStore.searchBrandGuidelines(brandId)
      
      // 3. Fusionner et valider
      const guidelines = this.mergeBrandData(notionData, vectorData)
      const validated = BrandGuidelinesSchema.parse(guidelines)
      
      // 4. Stocker en mémoire
      this.brandGuidelines.set(brandId, validated)
      
      logger.info('Brand guidelines loaded', { brandId, guidelines: Object.keys(validated) })
    } catch (error) {
      logger.error('Failed to load brand guidelines:', error)
      throw new Error(`Échec du chargement des guidelines: ${error.message}`)
    }
  }

  async generatePromptConstraints(brandId: string, context: {
    product: string
    objective: string
    audience: string
    platform: string
  }): Promise<z.infer<typeof PromptConstraintSchema>> {
    try {
      const guidelines = this.brandGuidelines.get(brandId)
      if (!guidelines) {
        throw new Error(`Guidelines non trouvées pour la marque: ${brandId}`)
      }

      // 1. Préparer les données pour le prompt
      const promptData = this.preparePromptData(guidelines, context)
      
      // 2. Générer les contraintes avec LLM
      const formattedPrompt = await this.prompt.format(promptData)
      const response = await this.llm.invoke(formattedPrompt)
      
      // 3. Parser la réponse JSON
      const jsonMatch = response.content.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('Réponse JSON invalide du modèle')
      }

      const parsed = JSON.parse(jsonMatch[0])
      const validated = PromptConstraintSchema.parse(parsed)
      
      // 4. Enrichir avec des exemples similaires
      const enrichedConstraints = await this.enrichWithExamples(brandId, validated, context)
      
      logger.info('Prompt constraints generated', { 
        brandId, 
        constraints: Object.keys(enrichedConstraints) 
      })
      
      return enrichedConstraints
    } catch (error) {
      logger.error('Failed to generate prompt constraints:', error)
      throw new Error(`Échec de la génération des contraintes: ${error.message}`)
    }
  }

  private mergeBrandData(notionData: any, vectorData: any) {
    return {
      ...notionData,
      ...vectorData,
      // Priorité aux données Notion (source de vérité)
      logo: { ...vectorData.logo, ...notionData.logo },
      colors: { ...vectorData.colors, ...notionData.colors },
      typography: { ...vectorData.typography, ...notionData.typography },
      tone: { ...vectorData.tone, ...notionData.tone },
      claims: { ...vectorData.claims, ...notionData.claims },
    }
  }

  private preparePromptData(guidelines: z.infer<typeof BrandGuidelinesSchema>, context: any) {
    return {
      guidelines: JSON.stringify(guidelines),
      brandName: guidelines.brandName,
      product: context.product,
      objective: context.objective,
      audience: context.audience,
      platform: context.platform,
      logoPlacement: guidelines.logo.placement,
      logoSize: `${guidelines.logo.size.min}-${guidelines.logo.size.max}px`,
      logoClearSpace: `${guidelines.logo.clearSpace}px`,
      logoConstraints: `Logo ${guidelines.brandName} obligatoire en ${guidelines.logo.placement}`,
      primaryColors: guidelines.colors.primary.join(', '),
      secondaryColors: guidelines.colors.secondary.join(', '),
      accentColors: guidelines.colors.accent.join(', '),
      forbiddenColors: guidelines.colors.forbidden.join(', '),
      colorConstraints: `Utiliser ${guidelines.colors.primary.join(', ')}, éviter ${guidelines.colors.forbidden.join(', ')}`,
      primaryFont: guidelines.typography.primary,
      secondaryFont: guidelines.typography.secondary,
      fontSizes: `H1: ${guidelines.typography.sizes.heading}px, Body: ${guidelines.typography.sizes.body}px`,
      typographyConstraints: `Police ${guidelines.typography.primary} pour titres, ${guidelines.typography.secondary} pour texte`,
      brandVoice: guidelines.tone.voice,
      brandPersonality: guidelines.tone.personality.join(', '),
      forbiddenTone: guidelines.tone.forbidden.join(', '),
      toneConstraints: `Ton ${guidelines.tone.voice}, éviter ${guidelines.tone.forbidden.join(', ')}`,
      allowedClaims: guidelines.claims.allowed.join(', '),
      forbiddenClaims: guidelines.claims.forbidden.join(', '),
      legalClaims: guidelines.claims.legal.join(', '),
      claimConstraints: `Claims autorisés: ${guidelines.claims.allowed.join(', ')}, interdits: ${guidelines.claims.forbidden.join(', ')}`,
      dos: guidelines.dos,
      donts: guidelines.donts,
      examples: guidelines.examples.map(e => e.description),
      example1: guidelines.examples[0]?.description || '',
      example2: guidelines.examples[1]?.description || '',
      technicalSpecs: `Format ${context.platform}, résolution optimale, watermark SynthID`,
    }
  }

  private async enrichWithExamples(brandId: string, constraints: any, context: any) {
    try {
      // Rechercher des exemples similaires dans la base de données
      const similarExamples = await this.vectorStore.findSimilarCampaigns(brandId, context)
      
      if (similarExamples.length > 0) {
        constraints.examples.push(
          ...similarExamples.map(example => 
            `Exemple similaire: ${example.description} (${example.platform})`
          )
        )
      }
      
      return constraints
    } catch (error) {
      logger.warn('Failed to enrich with examples:', error)
      return constraints
    }
  }

  async validatePromptAgainstBrand(brandId: string, prompt: string): Promise<{
    isValid: boolean
    score: number
    violations: string[]
    suggestions: string[]
  }> {
    try {
      const guidelines = this.brandGuidelines.get(brandId)
      if (!guidelines) {
        throw new Error(`Guidelines non trouvées pour la marque: ${brandId}`)
      }

      const violations: string[] = []
      const suggestions: string[] = []
      let score = 100

      // Vérifier le logo
      if (!prompt.toLowerCase().includes(guidelines.brandName.toLowerCase())) {
        violations.push('Nom de marque manquant')
        suggestions.push(`Inclure "${guidelines.brandName}" dans le prompt`)
        score -= 20
      }

      // Vérifier les couleurs
      const forbiddenColors = guidelines.colors.forbidden
      for (const color of forbiddenColors) {
        if (prompt.toLowerCase().includes(color.toLowerCase())) {
          violations.push(`Couleur interdite: ${color}`)
          suggestions.push(`Remplacer par ${guidelines.colors.primary.join(' ou ')}`)
          score -= 15
        }
      }

      // Vérifier le ton
      const forbiddenTone = guidelines.tone.forbidden
      for (const tone of forbiddenTone) {
        if (prompt.toLowerCase().includes(tone.toLowerCase())) {
          violations.push(`Ton interdit: ${tone}`)
          suggestions.push(`Utiliser le ton ${guidelines.tone.voice}`)
          score -= 10
        }
      }

      // Vérifier les claims
      const forbiddenClaims = guidelines.claims.forbidden
      for (const claim of forbiddenClaims) {
        if (prompt.toLowerCase().includes(claim.toLowerCase())) {
          violations.push(`Claim interdit: ${claim}`)
          suggestions.push(`Utiliser les claims autorisés: ${guidelines.claims.allowed.join(', ')}`)
          score -= 25
        }
      }

      return {
        isValid: violations.length === 0,
        score: Math.max(0, score),
        violations,
        suggestions,
      }
    } catch (error) {
      logger.error('Failed to validate prompt:', error)
      throw new Error(`Échec de la validation: ${error.message}`)
    }
  }

  async updateBrandGuidelines(brandId: string, updates: Partial<z.infer<typeof BrandGuidelinesSchema>>) {
    try {
      const current = this.brandGuidelines.get(brandId)
      if (!current) {
        throw new Error(`Guidelines non trouvées pour la marque: ${brandId}`)
      }

      const updated = { ...current, ...updates }
      const validated = BrandGuidelinesSchema.parse(updated)
      
      this.brandGuidelines.set(brandId, validated)
      
      // Synchroniser avec Notion
      await this.notion.updateBrandGuidelines(brandId, updates)
      
      // Mettre à jour le Vector Store
      await this.vectorStore.updateBrandGuidelines(brandId, updates)
      
      logger.info('Brand guidelines updated', { brandId, updates: Object.keys(updates) })
    } catch (error) {
      logger.error('Failed to update brand guidelines:', error)
      throw new Error(`Échec de la mise à jour: ${error.message}`)
    }
  }

  async getBrandStatus(brandId: string) {
    const guidelines = this.brandGuidelines.get(brandId)
    if (!guidelines) {
      return { loaded: false, message: 'Guidelines non chargées' }
    }

    return {
      loaded: true,
      brandName: guidelines.brandName,
      lastUpdated: new Date().toISOString(),
      guidelines: {
        logo: !!guidelines.logo,
        colors: guidelines.colors.primary.length > 0,
        typography: !!guidelines.typography.primary,
        tone: !!guidelines.tone.voice,
        claims: guidelines.claims.allowed.length > 0,
        dos: guidelines.dos.length,
        donts: guidelines.donts.length,
        examples: guidelines.examples.length,
      },
    }
  }
}
