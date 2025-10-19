import { StateGraph, END, START } from 'langgraph'
import { MemorySaver } from 'langgraph/checkpoint/memory'
import { BriefGenerator } from './agents/brief-generator'
import { BriefJudge } from './agents/brief-judge'
import { PromptSmith } from './agents/prompt-smith'
import { ImageArtisan } from './agents/image-artisan'
import { Animator } from './agents/animator'
import { Editor } from './agents/editor'
import { MusicGenerator } from './agents/music-generator'
import { VoiceGenerator } from './agents/voice-generator'
import { SpecCheck } from './agents/spec-check'
import { Compliance } from './agents/compliance'
import { WorkflowState, AgentResult } from './types'

export class WorkflowOrchestratorV1 {
  private agents: Map<string, any>
  private graph: StateGraph<WorkflowState>

  constructor() {
    this.agents = new Map()
    this.initializeAgents()
    this.buildGraph()
  }

  private initializeAgents() {
    this.agents.set('brief-gen', new BriefGenerator())
    this.agents.set('brief-judge', new BriefJudge())
    this.agents.set('prompt-smith', new PromptSmith())
    this.agents.set('image-artisan', new ImageArtisan())
    this.agents.set('animator', new Animator())
    this.agents.set('editor', new Editor())
    this.agents.set('music-gen', new MusicGenerator())
    this.agents.set('voice-gen', new VoiceGenerator())
    this.agents.set('spec-check', new SpecCheck())
    this.agents.set('compliance', new Compliance())
  }

  private buildGraph() {
    // Nouvelle API LangGraph v0.4 avec gestion des interruptions
    this.graph = new StateGraph<WorkflowState>({
      channels: {
        jobId: { value: null },
        status: { value: 'pending' },
        currentStep: { value: null },
        results: { value: {} },
        errors: { value: {} },
        metadata: { value: {} },
        // Nouveaux champs pour la gestion des interruptions
        interruptPoints: { value: [] },
        humanApproval: { value: false },
        retryCount: { value: 0 },
      },
    })

    // Ajouter les nœuds avec gestion des interruptions
    this.graph.addNode('brief-generation', this.briefGenerationNode.bind(this))
    this.graph.addNode('brief-evaluation', this.briefEvaluationNode.bind(this))
    this.graph.addNode('prompt-optimization', this.promptOptimizationNode.bind(this))
    this.graph.addNode('image-generation', this.imageGenerationNode.bind(this))
    this.graph.addNode('video-animation', this.videoAnimationNode.bind(this))
    this.graph.addNode('video-editing', this.videoEditingNode.bind(this))
    this.graph.addNode('audio-generation', this.audioGenerationNode.bind(this))
    this.graph.addNode('spec-check', this.specCheckNode.bind(this))
    this.graph.addNode('compliance-check', this.complianceCheckNode.bind(this))
    this.graph.addNode('human-approval', this.humanApprovalNode.bind(this))
    this.graph.addNode('error-handling', this.errorHandlingNode.bind(this))

    // Définir le point de départ
    this.graph.setEntryPoint(START)

    // Ajouter les arêtes avec gestion des interruptions
    this.graph.addEdge(START, 'brief-generation')
    this.graph.addEdge('brief-generation', 'brief-evaluation')
    
    // Gestion conditionnelle avec interruptions
    this.graph.addConditionalEdges(
      'brief-evaluation',
      this.shouldContinueAfterEvaluation.bind(this),
      {
        'continue': 'prompt-optimization',
        'retry': 'brief-generation',
        'interrupt': 'human-approval',
        'error': 'error-handling',
      }
    )

    this.graph.addEdge('prompt-optimization', 'image-generation')
    this.graph.addEdge('image-generation', 'video-animation')
    this.graph.addEdge('video-animation', 'video-editing')
    this.graph.addEdge('video-editing', 'audio-generation')
    this.graph.addEdge('audio-generation', 'spec-check')
    this.graph.addEdge('spec-check', 'compliance-check')
    
    // Gestion des interruptions pour l'approbation humaine
    this.graph.addConditionalEdges(
      'compliance-check',
      this.shouldRequireHumanApproval.bind(this),
      {
        'approve': END,
        'interrupt': 'human-approval',
        'retry': 'image-generation',
        'error': 'error-handling',
      }
    )

    // Gestion des interruptions pour l'approbation humaine
    this.graph.addConditionalEdges(
      'human-approval',
      this.getHumanApprovalResult.bind(this),
      {
        'approved': END,
        'rejected': 'brief-generation',
        'pending': 'human-approval',
      }
    )

    // Gestion des erreurs
    this.graph.addConditionalEdges(
      'error-handling',
      this.getErrorHandlingResult.bind(this),
      {
        'retry': 'brief-generation',
        'abort': END,
      }
    )
  }

  // Nœuds avec gestion des interruptions améliorée
  private async briefGenerationNode(state: WorkflowState): Promise<Partial<WorkflowState>> {
    try {
      const agent = this.agents.get('brief-gen')
      const result = await agent.generate(state)
      
      // Vérifier si une interruption est nécessaire
      if (result.requiresHumanApproval) {
        return {
          ...state,
          currentStep: 'brief-generation',
          status: 'interrupted',
          interruptPoints: [...state.interruptPoints, 'brief-generation'],
          humanApproval: true,
          results: {
            ...state.results,
            'brief-generation': result,
          },
        }
      }

      return {
        ...state,
        currentStep: 'brief-generation',
        status: 'running',
        results: {
          ...state.results,
          'brief-generation': result,
        },
      }
    } catch (error) {
      return {
        ...state,
        currentStep: 'brief-generation',
        status: 'error',
        errors: {
          ...state.errors,
          'brief-generation': error.message,
        },
      }
    }
  }

  private async briefEvaluationNode(state: WorkflowState): Promise<Partial<WorkflowState>> {
    try {
      const agent = this.agents.get('brief-judge')
      const result = await agent.evaluate(state)
      
      return {
        ...state,
        currentStep: 'brief-evaluation',
        status: 'running',
        results: {
          ...state.results,
          'brief-evaluation': result,
        },
      }
    } catch (error) {
      return {
        ...state,
        currentStep: 'brief-evaluation',
        status: 'error',
        errors: {
          ...state.errors,
          'brief-evaluation': error.message,
        },
      }
    }
  }

  private async promptOptimizationNode(state: WorkflowState): Promise<Partial<WorkflowState>> {
    try {
      const agent = this.agents.get('prompt-smith')
      const result = await agent.optimize(state)
      
      return {
        ...state,
        currentStep: 'prompt-optimization',
        status: 'running',
        results: {
          ...state.results,
          'prompt-optimization': result,
        },
      }
    } catch (error) {
      return {
        ...state,
        currentStep: 'prompt-optimization',
        status: 'error',
        errors: {
          ...state.errors,
          'prompt-optimization': error.message,
        },
      }
    }
  }

  private async imageGenerationNode(state: WorkflowState): Promise<Partial<WorkflowState>> {
    try {
      const agent = this.agents.get('image-artisan')
      const result = await agent.generate(state)
      
      return {
        ...state,
        currentStep: 'image-generation',
        status: 'running',
        results: {
          ...state.results,
          'image-generation': result,
        },
      }
    } catch (error) {
      return {
        ...state,
        currentStep: 'image-generation',
        status: 'error',
        errors: {
          ...state.errors,
          'image-generation': error.message,
        },
      }
    }
  }

  private async videoAnimationNode(state: WorkflowState): Promise<Partial<WorkflowState>> {
    try {
      const agent = this.agents.get('animator')
      const result = await agent.animate(state)
      
      return {
        ...state,
        currentStep: 'video-animation',
        status: 'running',
        results: {
          ...state.results,
          'video-animation': result,
        },
      }
    } catch (error) {
      return {
        ...state,
        currentStep: 'video-animation',
        status: 'error',
        errors: {
          ...state.errors,
          'video-animation': error.message,
        },
      }
    }
  }

  private async videoEditingNode(state: WorkflowState): Promise<Partial<WorkflowState>> {
    try {
      const agent = this.agents.get('editor')
      const result = await agent.edit(state)
      
      return {
        ...state,
        currentStep: 'video-editing',
        status: 'running',
        results: {
          ...state.results,
          'video-editing': result,
        },
      }
    } catch (error) {
      return {
        ...state,
        currentStep: 'video-editing',
        status: 'error',
        errors: {
          ...state.errors,
          'video-editing': error.message,
        },
      }
    }
  }

  private async audioGenerationNode(state: WorkflowState): Promise<Partial<WorkflowState>> {
    try {
      const agent = this.agents.get('music-gen')
      const result = await agent.generate(state)
      
      return {
        ...state,
        currentStep: 'audio-generation',
        status: 'running',
        results: {
          ...state.results,
          'audio-generation': result,
        },
      }
    } catch (error) {
      return {
        ...state,
        currentStep: 'audio-generation',
        status: 'error',
        errors: {
          ...state.errors,
          'audio-generation': error.message,
        },
      }
    }
  }

  private async specCheckNode(state: WorkflowState): Promise<Partial<WorkflowState>> {
    try {
      const agent = this.agents.get('spec-check')
      const result = await agent.check(state)
      
      return {
        ...state,
        currentStep: 'spec-check',
        status: 'running',
        results: {
          ...state.results,
          'spec-check': result,
        },
      }
    } catch (error) {
      return {
        ...state,
        currentStep: 'spec-check',
        status: 'error',
        errors: {
          ...state.errors,
          'spec-check': error.message,
        },
      }
    }
  }

  private async complianceCheckNode(state: WorkflowState): Promise<Partial<WorkflowState>> {
    try {
      const agent = this.agents.get('compliance')
      const result = await agent.check(state)
      
      return {
        ...state,
        currentStep: 'compliance-check',
        status: 'running',
        results: {
          ...state.results,
          'compliance-check': result,
        },
      }
    } catch (error) {
      return {
        ...state,
        currentStep: 'compliance-check',
        status: 'error',
        errors: {
          ...state.errors,
          'compliance-check': error.message,
        },
      }
    }
  }

  private async humanApprovalNode(state: WorkflowState): Promise<Partial<WorkflowState>> {
    // Gestion des interruptions pour l'approbation humaine
    return {
      ...state,
      currentStep: 'human-approval',
      status: 'interrupted',
      humanApproval: true,
    }
  }

  private async errorHandlingNode(state: WorkflowState): Promise<Partial<WorkflowState>> {
    // Gestion des erreurs avec retry logic
    const retryCount = state.retryCount || 0
    const maxRetries = 3

    if (retryCount < maxRetries) {
      return {
        ...state,
        retryCount: retryCount + 1,
        status: 'retrying',
      }
    }

    return {
      ...state,
      status: 'failed',
    }
  }

  // Fonctions de routage conditionnel améliorées
  private shouldContinueAfterEvaluation(state: WorkflowState): string {
    const evaluation = state.results['brief-evaluation']
    
    if (!evaluation || evaluation.status === 'error') {
      return 'error'
    }
    
    if (evaluation.requiresHumanApproval) {
      return 'interrupt'
    }
    
    if (evaluation.score < 6) {
      return 'retry'
    }
    
    return 'continue'
  }

  private shouldRequireHumanApproval(state: WorkflowState): string {
    const compliance = state.results['compliance-check']
    
    if (!compliance || compliance.status === 'error') {
      return 'error'
    }
    
    if (compliance.requiresHumanApproval) {
      return 'interrupt'
    }
    
    if (compliance.score < 8) {
      return 'retry'
    }
    
    return 'approve'
  }

  private getHumanApprovalResult(state: WorkflowState): string {
    const approval = state.metadata.humanApproval
    
    if (approval === 'approved') return 'approved'
    if (approval === 'rejected') return 'rejected'
    return 'pending'
  }

  private getErrorHandlingResult(state: WorkflowState): string {
    const retryCount = state.retryCount || 0
    const maxRetries = 3
    
    if (retryCount < maxRetries) {
      return 'retry'
    }
    
    return 'abort'
  }

  // Méthode d'exécution avec gestion des interruptions (LangGraph v0.4)
  async executeWorkflow(initialState: Partial<WorkflowState>): Promise<WorkflowState> {
    const compiledGraph = this.graph.compile({
      // Nouvelle API LangGraph v0.4 avec MemorySaver
      checkpointer: new MemorySaver(),
      interruptBefore: ['human-approval'],
      interruptAfter: ['brief-generation', 'compliance-check'],
    })
    
    // Exécution avec gestion des interruptions
    const result = await compiledGraph.invoke(initialState as WorkflowState, {
      // Configuration pour la gestion des interruptions
      configurable: {
        thread_id: initialState.jobId || 'default-thread',
      },
    })
    
    return result
  }

  // Méthode pour reprendre après une interruption
  async resumeWorkflow(state: WorkflowState, humanDecision: 'approved' | 'rejected'): Promise<WorkflowState> {
    const updatedState = {
      ...state,
      humanApproval: humanDecision,
      status: 'running',
    }
    
    const compiledGraph = this.graph.compile()
    return await compiledGraph.invoke(updatedState)
  }
}
