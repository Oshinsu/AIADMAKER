#!/usr/bin/env tsx

/**
 * TEST PROMPTS SOTA 2025
 * Script de validation des system prompts optimisés
 */

import { SOTA_PROMPTS_2025 } from '../packages/agents/src/prompts/sota-prompts-2025'

interface PromptTestResult {
  agent: string
  promptLength: number
  hasRole: boolean
  hasMission: boolean
  hasMethodology: boolean
  hasOutput: boolean
  hasExamples: boolean
  hasConstraints: boolean
  score: number
  recommendations: string[]
}

class PromptTester {
  private results: PromptTestResult[] = []

  testPrompt(agent: string, prompt: string): PromptTestResult {
    const result: PromptTestResult = {
      agent,
      promptLength: prompt.length,
      hasRole: this.hasRole(prompt),
      hasMission: this.hasMission(prompt),
      hasMethodology: this.hasMethodology(prompt),
      hasOutput: this.hasOutput(prompt),
      hasExamples: this.hasExamples(prompt),
      hasConstraints: this.hasConstraints(prompt),
      score: 0,
      recommendations: []
    }

    // Calcul du score
    result.score = this.calculateScore(result)
    
    // Génération des recommandations
    result.recommendations = this.generateRecommendations(result)

    this.results.push(result)
    return result
  }

  private hasRole(prompt: string): boolean {
    return prompt.includes('ROLE:') || prompt.includes('IDENTITÉ PROFESSIONNELLE')
  }

  private hasMission(prompt: string): boolean {
    return prompt.includes('MISSION PRINCIPALE') || prompt.includes('MISSION:')
  }

  private hasMethodology(prompt: string): boolean {
    return prompt.includes('MÉTHODOLOGIE') || prompt.includes('FRAMEWORK')
  }

  private hasOutput(prompt: string): boolean {
    return prompt.includes('OUTPUT') || prompt.includes('JSON') || prompt.includes('STRUCTURÉ')
  }

  private hasExamples(prompt: string): boolean {
    return prompt.includes('EXEMPLES') || prompt.includes('EXAMPLES') || prompt.includes('exemple')
  }

  private hasConstraints(prompt: string): boolean {
    return prompt.includes('CONTRAINTES') || prompt.includes('CONSTRAINTS') || prompt.includes('GUIDELINES')
  }

  private calculateScore(result: PromptTestResult): number {
    let score = 0
    
    // Critères essentiels (2 points chacun)
    if (result.hasRole) score += 2
    if (result.hasMission) score += 2
    if (result.hasMethodology) score += 2
    if (result.hasOutput) score += 2
    
    // Critères importants (1 point chacun)
    if (result.hasExamples) score += 1
    if (result.hasConstraints) score += 1
    
    // Longueur du prompt (max 1 point)
    if (result.promptLength > 2000) score += 1
    else if (result.promptLength > 1000) score += 0.5
    
    return Math.min(score, 10)
  }

  private generateRecommendations(result: PromptTestResult): string[] {
    const recommendations: string[] = []
    
    if (!result.hasRole) {
      recommendations.push('Ajouter une section ROLE/IDENTITÉ PROFESSIONNELLE')
    }
    
    if (!result.hasMission) {
      recommendations.push('Définir clairement la MISSION PRINCIPALE')
    }
    
    if (!result.hasMethodology) {
      recommendations.push('Structurer la MÉTHODOLOGIE en étapes claires')
    }
    
    if (!result.hasOutput) {
      recommendations.push('Préciser le format de sortie (JSON, structure)')
    }
    
    if (!result.hasExamples) {
      recommendations.push('Ajouter des exemples concrets et représentatifs')
    }
    
    if (!result.hasConstraints) {
      recommendations.push('Intégrer les contraintes brand et techniques')
    }
    
    if (result.promptLength < 1000) {
      recommendations.push('Enrichir le prompt avec plus de contexte et détails')
    }
    
    if (result.promptLength > 5000) {
      recommendations.push('Optimiser la longueur du prompt pour éviter la surcharge')
    }
    
    return recommendations
  }

  generateReport(): void {
    console.log('\n🎯 RAPPORT DE VALIDATION PROMPTS SOTA 2025\n')
    console.log('=' .repeat(60))
    
    let totalScore = 0
    let excellentCount = 0
    let goodCount = 0
    let needsImprovementCount = 0
    
    this.results.forEach(result => {
      const status = result.score >= 9 ? '🟢 EXCELLENT' : 
                    result.score >= 7 ? '🟡 BON' : '🔴 À AMÉLIORER'
      
      console.log(`\n📋 ${result.agent.toUpperCase()}`)
      console.log(`   Score: ${result.score}/10 ${status}`)
      console.log(`   Longueur: ${result.promptLength} caractères`)
      console.log(`   Critères:`)
      console.log(`   ✅ Rôle: ${result.hasRole ? '✓' : '✗'}`)
      console.log(`   ✅ Mission: ${result.hasMission ? '✓' : '✗'}`)
      console.log(`   ✅ Méthodologie: ${result.hasMethodology ? '✓' : '✗'}`)
      console.log(`   ✅ Output: ${result.hasOutput ? '✓' : '✗'}`)
      console.log(`   ✅ Exemples: ${result.hasExamples ? '✓' : '✗'}`)
      console.log(`   ✅ Contraintes: ${result.hasConstraints ? '✓' : '✗'}`)
      
      if (result.recommendations.length > 0) {
        console.log(`   📝 Recommandations:`)
        result.recommendations.forEach(rec => console.log(`      • ${rec}`))
      }
      
      totalScore += result.score
      if (result.score >= 9) excellentCount++
      else if (result.score >= 7) goodCount++
      else needsImprovementCount++
    })
    
    const averageScore = totalScore / this.results.length
    
    console.log('\n' + '=' .repeat(60))
    console.log('📊 RÉSUMÉ GLOBAL')
    console.log('=' .repeat(60))
    console.log(`Score moyen: ${averageScore.toFixed(1)}/10`)
    console.log(`🟢 Excellents: ${excellentCount}`)
    console.log(`🟡 Bons: ${goodCount}`)
    console.log(`🔴 À améliorer: ${needsImprovementCount}`)
    
    if (averageScore >= 9) {
      console.log('\n🎉 FÉLICITATIONS ! Tous les prompts sont SOTA 2025 !')
    } else if (averageScore >= 7) {
      console.log('\n✅ Bon niveau global, quelques optimisations possibles')
    } else {
      console.log('\n⚠️  Améliorations nécessaires pour atteindre le niveau SOTA 2025')
    }
    
    console.log('\n🚀 PROCHAINES ÉTAPES:')
    console.log('1. Implémenter les recommandations')
    console.log('2. Tester les prompts en conditions réelles')
    console.log('3. Mesurer les performances')
    console.log('4. Itérer et optimiser')
  }
}

async function main() {
  console.log('🧪 TEST DES PROMPTS SOTA 2025')
  console.log('Validation des system prompts optimisés...\n')
  
  const tester = new PromptTester()
  
  // Test de tous les prompts SOTA 2025
  const prompts = [
    { name: 'Brief Generator', prompt: SOTA_PROMPTS_2025.BRIEF_GENERATOR },
    { name: 'Brief Judge', prompt: SOTA_PROMPTS_2025.BRIEF_JUDGE },
    { name: 'Brand Brain', prompt: SOTA_PROMPTS_2025.BRAND_BRAIN },
    { name: 'Prompt Smith', prompt: SOTA_PROMPTS_2025.PROMPT_SMITH },
    { name: 'Image Artisan', prompt: SOTA_PROMPTS_2025.IMAGE_ARTISAN },
    { name: 'Animator', prompt: SOTA_PROMPTS_2025.ANIMATOR },
    { name: 'Music Generator', prompt: SOTA_PROMPTS_2025.MUSIC_GENERATOR },
    { name: 'Voice Generator', prompt: SOTA_PROMPTS_2025.VOICE_GENERATOR },
    { name: 'Creative Evaluator', prompt: SOTA_PROMPTS_2025.CREATIVE_EVALUATOR }
  ]
  
  prompts.forEach(({ name, prompt }) => {
    tester.testPrompt(name, prompt)
  })
  
  // Génération du rapport
  tester.generateReport()
  
  console.log('\n✨ Test terminé !')
}

if (require.main === module) {
  main().catch(console.error)
}

export { PromptTester }
