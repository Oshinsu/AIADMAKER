import { ChatOpenAI } from '@langchain/openai'
import { PromptTemplate } from '@langchain/core/prompts'
import { z } from 'zod'
import { BriefData } from '../types'
import { SOTA_PROMPTS_2025 } from '../prompts/sota-prompts-2025'

const EvaluationSchema = z.object({
  scores: z.array(z.object({
    briefId: z.number(),
    score: z.number().min(0).max(10),
    reasoning: z.string(),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
  })),
  winner: z.number(),
  winnerReasoning: z.string(),
  recommendations: z.array(z.string()),
})

export class BriefJudge {
  private llm: ChatOpenAI
  private prompt: PromptTemplate

  constructor() {
    this.llm = new ChatOpenAI({
      modelName: 'gpt-4o',
      temperature: 0.3,
      maxTokens: 1500,
    })

    this.prompt = new PromptTemplate({
      template: SOTA_PROMPTS_2025.BRIEF_JUDGE + `

## BRIEFS À ÉVALUER
{briefs}

Effectuer une évaluation complète selon cette méthodologie SOTA 2025.
`,
      inputVariables: ['briefs'],
    })
  }

  async evaluateBriefs(briefs: BriefData[]): Promise<{
    scores: Array<{
      briefId: number
      score: number
      reasoning: string
      strengths: string[]
      weaknesses: string[]
    }>
    winner: number
    winnerReasoning: string
    recommendations: string[]
  }> {
    try {
      const briefsText = briefs.map((brief, index) => `
BRIEF ${index}:
- Titre: ${brief.title}
- Objectif: ${brief.objective}
- Audience: ${brief.audience}
- Message clé: ${brief.keyMessage}
- CTA: ${brief.callToAction}
- Contraintes: ${brief.constraints.join(', ')}
- Formats: ${brief.formats.join(', ')}
${brief.budget ? `- Budget: ${brief.budget}€` : ''}
${brief.timeline ? `- Timeline: ${brief.timeline}` : ''}
`).join('\n')

      const formattedPrompt = await this.prompt.format({
        briefs: briefsText,
      })

      const response = await this.llm.invoke(formattedPrompt)
      
      // Parse JSON response
      const jsonMatch = response.content.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('Réponse JSON invalide du modèle')
      }

      const parsed = JSON.parse(jsonMatch[0])
      const validated = EvaluationSchema.parse(parsed)

      return validated
    } catch (error) {
      console.error('Erreur lors de l\'évaluation des briefs:', error)
      throw new Error(`Échec de l'évaluation des briefs: ${error.message}`)
    }
  }

  async selectBestBrief(briefs: BriefData[]): Promise<{
    selectedBrief: BriefData
    score: number
    reasoning: string
    recommendations: string[]
  }> {
    const evaluation = await this.evaluateBriefs(briefs)
    
    const selectedBrief = briefs[evaluation.winner]
    const selectedScore = evaluation.scores[evaluation.winner]

    return {
      selectedBrief,
      score: selectedScore.score,
      reasoning: evaluation.winnerReasoning,
      recommendations: evaluation.recommendations,
    }
  }

  async compareTwoBriefs(brief1: BriefData, brief2: BriefData): Promise<{
    winner: 'brief1' | 'brief2' | 'tie'
    reasoning: string
    scores: {
      brief1: number
      brief2: number
    }
  }> {
    const evaluation = await this.evaluateBriefs([brief1, brief2])
    
    const score1 = evaluation.scores[0].score
    const score2 = evaluation.scores[1].score
    
    let winner: 'brief1' | 'brief2' | 'tie'
    if (score1 > score2) winner = 'brief1'
    else if (score2 > score1) winner = 'brief2'
    else winner = 'tie'

    return {
      winner,
      reasoning: evaluation.winnerReasoning,
      scores: {
        brief1: score1,
        brief2: score2,
      },
    }
  }
}
