import { ChatOpenAI } from '@langchain/openai'
import { PromptTemplate } from '@langchain/core/prompts'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { z } from 'zod'
import { BriefData } from '../types'
import { SOTA_PROMPTS_2025 } from '../prompts/sota-prompts-2025'

const BriefSchema = z.object({
  title: z.string(),
  objective: z.string(),
  audience: z.string(),
  keyMessage: z.string(),
  callToAction: z.string(),
  constraints: z.array(z.string()),
  formats: z.array(z.string()),
  budget: z.number().optional(),
  timeline: z.string().optional(),
})

export class BriefGenerator {
  private llm: ChatOpenAI
  private prompt: PromptTemplate

  constructor() {
    this.llm = new ChatOpenAI({
      model: 'gpt-4o-2025-10-01', // Dernière version d'octobre 2025
      temperature: 0.7,
      maxTokens: 2000,
      apiKey: process.env.OPENAI_API_KEY,
      // Nouvelles options LangChain v1.0
      timeout: 30000,
      maxRetries: 3,
      streaming: false,
    })

    this.prompt = new PromptTemplate({
      template: SOTA_PROMPTS_2025.BRIEF_GENERATOR + `

## CONTEXTE CAMPAGNE
- Marque: {brand}
- Produit: {product}
- Objectif: {objective}
- Audience: {audience}
- Budget: {budget}
- Contraintes: {constraints}
- Formats: {formats}

Générer 3 briefs exceptionnels, chacun avec une approche stratégique distincte et des métriques de succès spécifiques.
`,
      inputVariables: [
        'brand',
        'product', 
        'objective',
        'audience',
        'budget',
        'constraints',
        'formats'
      ],
    })
  }

  async generateBriefs(input: {
    brand: string
    product: string
    objective: string
    audience: string
    budget?: number
    constraints: string[]
    formats: string[]
  }): Promise<BriefData[]> {
    try {
      const formattedPrompt = await this.prompt.format({
        brand: input.brand,
        product: input.product,
        objective: input.objective,
        audience: input.audience,
        budget: input.budget?.toString() || 'Non spécifié',
        constraints: input.constraints.join(', '),
        formats: input.formats.join(', '),
      })

      const response = await this.llm.invoke(formattedPrompt)
      
      // Parse JSON response
      const jsonMatch = response.content.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('Réponse JSON invalide du modèle')
      }

      const parsed = JSON.parse(jsonMatch[0])
      const briefs = parsed.briefs || []

      // Validate each brief
      const validatedBriefs = briefs.map((brief: any) => {
        const validated = BriefSchema.parse(brief)
        return validated
      })

      return validatedBriefs
    } catch (error) {
      console.error('Erreur lors de la génération des briefs:', error)
      throw new Error(`Échec de la génération des briefs: ${error.message}`)
    }
  }

  async generateSingleBrief(input: {
    brand: string
    product: string
    objective: string
    audience: string
    budget?: number
    constraints: string[]
    formats: string[]
    approach: 'emotional' | 'rational' | 'creative'
  }): Promise<BriefData> {
    const briefs = await this.generateBriefs(input)
    
    const approachMap = {
      emotional: 0,
      rational: 1,
      creative: 2,
    }

    return briefs[approachMap[input.approach]] || briefs[0]
  }
}
