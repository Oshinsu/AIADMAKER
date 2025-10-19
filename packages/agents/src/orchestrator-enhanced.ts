import { StateGraph, END } from 'langgraph'
import { BriefGenerator } from './agents/brief-generator'
import { BriefJudge } from './agents/brief-judge'
import { PromptSmith } from './agents/prompt-smith'
import { ImageArtisan } from './agents/image-artisan'
import { Animator } from './agents/animator'
import { Editor } from './agents/editor'
import { MusicGenerator } from './agents/music-generator'
import { VoiceGenerator } from './agents/voice-generator'
import { CreativeEvaluator } from './agents/creative-evaluator'
import { BrandBrain } from './agents/brand-brain'
import { MediaVendorRouter } from '@ai-ad-maker/connectors'
import { WorkflowState, AgentResult } from './types'

export class EnhancedWorkflowOrchestrator {
  private agents: Map<string, any>
  private graph: StateGraph<WorkflowState>
  private brandBrain: BrandBrain
  private vendorRouter: MediaVendorRouter
  private creativeEvaluator: CreativeEvaluator

  constructor() {
    this.agents = new Map()
    this.brandBrain = new BrandBrain()
    this.vendorRouter = new MediaVendorRouter()
    this.creativeEvaluator = new CreativeEvaluator()
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
  }

  private buildGraph() {
    this.graph = new StateGraph<WorkflowState>({
      channels: {
        jobId: { value: null },
        status: { value: 'pending' },
        currentStep: { value: null },
        results: { value: {} },
        errors: { value: {} },
        metadata: { value: {} },
      },
    })

    // Add nodes with enhanced functionality
    this.graph.addNode('brand-analysis', this.brandAnalysisNode.bind(this))
    this.graph.addNode('brief-generation', this.briefGenerationNode.bind(this))
    this.graph.addNode('brief-evaluation', this.briefEvaluationNode.bind(this))
    this.graph.addNode('prompt-optimization', this.promptOptimizationNode.bind(this))
    this.graph.addNode('vendor-routing', this.vendorRoutingNode.bind(this))
    this.graph.addNode('image-generation', this.imageGenerationNode.bind(this))
    this.graph.addNode('video-animation', this.videoAnimationNode.bind(this))
    this.graph.addNode('video-editing', this.videoEditingNode.bind(this))
    this.graph.addNode('audio-generation', this.audioGenerationNode.bind(this))
    this.graph.addNode('creative-evaluation', this.creativeEvaluationNode.bind(this))
    this.graph.addNode('human-approval', this.humanApprovalNode.bind(this))

    // Add edges with enhanced routing
    this.graph.addEdge('brand-analysis', 'brief-generation')
    this.graph.addEdge('brief-generation', 'brief-evaluation')
    this.graph.addConditionalEdges(
      'brief-evaluation',
      this.shouldContinueAfterEvaluation.bind(this),
      {
        'continue': 'prompt-optimization',
        'retry': 'brief-generation',
        'end': END,
      }
    )
    this.graph.addEdge('prompt-optimization', 'vendor-routing')
    this.graph.addEdge('vendor-routing', 'image-generation')
    this.graph.addEdge('image-generation', 'video-animation')
    this.graph.addEdge('video-animation', 'video-editing')
    this.graph.addEdge('video-editing', 'audio-generation')
    this.graph.addEdge('audio-generation', 'creative-evaluation')
    this.graph.addConditionalEdges(
      'creative-evaluation',
      this.shouldRequireHumanApproval.bind(this),
      {
        'approve': 'human-approval',
        'auto-approve': END,
        'retry': 'vendor-routing',
      }
    )
    this.graph.addConditionalEdges(
      'human-approval',
      this.getHumanApprovalResult.bind(this),
      {
        'approved': END,
        'rejected': 'brief-generation',
        'pending': 'human-approval',
      }
    )

    // Set entry point
    this.graph.setEntryPoint('brand-analysis')
  }

  private async brandAnalysisNode(state: WorkflowState): Promise<Partial<WorkflowState>> {
    try {
      const brandId = state.metadata.brandId
      if (!brandId) {
        throw new Error('Brand ID requis pour l\'analyse de marque')
      }

      // Charger les guidelines de marque
      await this.brandBrain.loadBrandGuidelines(brandId)
      
      // Générer les contraintes de prompt
      const constraints = await this.brandBrain.generatePromptConstraints(brandId, {
        product: state.metadata.product,
        objective: state.metadata.objective,
        audience: state.metadata.audience,
        platform: state.metadata.platform,
      })

      return {
        currentStep: 'brand-analysis',
        results: {
          ...state.results,
          'brand-analysis': {
            agentId: 'brand-brain',
            status: 'success',
            data: constraints,
          },
        },
      }
    } catch (error) {
      return {
        currentStep: 'brand-analysis',
        results: {
          ...state.results,
          'brand-analysis': {
            agentId: 'brand-brain',
            status: 'error',
            error: error.message,
          },
        },
        errors: {
          ...state.errors,
          'brand-analysis': error.message,
        },
      }
    }
  }

  private async vendorRoutingNode(state: WorkflowState): Promise<Partial<WorkflowState>> {
    try {
      const brief = state.results['brief-evaluation']?.data?.selectedBrief
      const brandConstraints = state.results['brand-analysis']?.data
      
      if (!brief || !brandConstraints) {
        throw new Error('Brief et contraintes de marque requis pour le routing')
      }

      // Déterminer le type de génération nécessaire
      const generationType = this.determineGenerationType(brief, state.metadata)
      
      // Router vers le meilleur vendor
      const routingDecision = await this.vendorRouter.routeRequest({
        type: generationType,
        task: brief.objective,
        requirements: {
          quality: state.metadata.quality || 'high',
          format: state.metadata.platform,
          resolution: state.metadata.resolution || '1080p',
          budget: state.metadata.budget,
          deadline: state.metadata.deadline,
        },
        constraints: {
          maxCost: state.metadata.maxCost,
          maxLatency: state.metadata.maxLatency,
          requiredCapabilities: this.getRequiredCapabilities(brief),
          preferredVendors: state.metadata.preferredVendors,
          blockedVendors: state.metadata.blockedVendors,
        },
      })

      return {
        currentStep: 'vendor-routing',
        results: {
          ...state.results,
          'vendor-routing': {
            agentId: 'media-vendor-router',
            status: 'success',
            data: routingDecision,
          },
        },
      }
    } catch (error) {
      return {
        currentStep: 'vendor-routing',
        results: {
          ...state.results,
          'vendor-routing': {
            agentId: 'media-vendor-router',
            status: 'error',
            error: error.message,
          },
        },
        errors: {
          ...state.errors,
          'vendor-routing': error.message,
        },
      }
    }
  }

  private async creativeEvaluationNode(state: WorkflowState): Promise<Partial<WorkflowState>> {
    try {
      const assets = {
        images: state.results['image-generation']?.data,
        videos: state.results['video-editing']?.data,
        audio: state.results['audio-generation']?.data,
      }

      const evaluations = []
      const blockingIssues = []

      // Évaluer chaque asset
      for (const [type, assetList] of Object.entries(assets)) {
        if (!assetList || !Array.isArray(assetList)) continue

        for (const asset of assetList) {
          const evaluation = await this.creativeEvaluator.evaluateAsset({
            url: asset.url,
            type: type as 'image' | 'video',
            platform: state.metadata.platform,
            metadata: asset.metadata,
          })

          evaluations.push({
            assetId: asset.id,
            type,
            evaluation,
          })

          // Collecter les problèmes bloquants
          if (evaluation.requiresHumanApproval) {
            blockingIssues.push(...evaluation.blockingIssues)
          }
        }
      }

      // Déterminer si une approbation humaine est nécessaire
      const requiresHumanApproval = blockingIssues.length > 0 || 
        evaluations.some(e => e.evaluation.overallScore < 6.0)

      return {
        currentStep: 'creative-evaluation',
        results: {
          ...state.results,
          'creative-evaluation': {
            agentId: 'creative-evaluator',
            status: 'success',
            data: {
              evaluations,
              overallScore: this.calculateOverallScore(evaluations),
              requiresHumanApproval,
              blockingIssues,
            },
          },
        },
      }
    } catch (error) {
      return {
        currentStep: 'creative-evaluation',
        results: {
          ...state.results,
          'creative-evaluation': {
            agentId: 'creative-evaluator',
            status: 'error',
            error: error.message,
          },
        },
        errors: {
          ...state.errors,
          'creative-evaluation': error.message,
        },
      }
    }
  }

  private determineGenerationType(brief: any, metadata: any): 'image' | 'video' | 'audio' {
    // Logique pour déterminer le type de génération basé sur le brief et les métadonnées
    if (metadata.platform === 'instagram' && brief.formats.includes('story')) {
      return 'video'
    }
    if (brief.formats.includes('facebook') || brief.formats.includes('twitter')) {
      return 'image'
    }
    return 'video' // Par défaut
  }

  private getRequiredCapabilities(brief: any): string[] {
    const capabilities = []
    
    if (brief.formats.includes('facebook')) capabilities.push('16:9')
    if (brief.formats.includes('instagram')) capabilities.push('1:1', '9:16')
    if (brief.formats.includes('tiktok')) capabilities.push('9:16', 'vertical')
    if (brief.objective.includes('émotion')) capabilities.push('emotional')
    if (brief.objective.includes('rationnel')) capabilities.push('factual')
    
    return capabilities
  }

  private calculateOverallScore(evaluations: any[]): number {
    if (evaluations.length === 0) return 0
    
    const totalScore = evaluations.reduce((sum, eval) => sum + eval.evaluation.overallScore, 0)
    return totalScore / evaluations.length
  }

  private shouldContinueAfterEvaluation(state: WorkflowState): string {
    const evaluation = state.results['brief-evaluation']
    if (!evaluation || evaluation.status === 'error') {
      return 'retry'
    }
    
    const score = evaluation.data?.winnerScore
    if (score && score < 6) {
      return 'retry'
    }
    
    return 'continue'
  }

  private shouldRequireHumanApproval(state: WorkflowState): string {
    const evaluation = state.results['creative-evaluation']
    if (!evaluation || evaluation.status === 'error') {
      return 'approve'
    }
    
    const data = evaluation.data
    if (data.requiresHumanApproval || data.overallScore < 6.0) {
      return 'approve'
    }
    
    if (data.overallScore < 8.0) {
      return 'retry'
    }
    
    return 'auto-approve'
  }

  private getHumanApprovalResult(state: WorkflowState): string {
    const approval = state.metadata.humanApproval
    if (approval === 'approved') return 'approved'
    if (approval === 'rejected') return 'rejected'
    return 'pending'
  }

  async executeWorkflow(initialState: Partial<WorkflowState>): Promise<WorkflowState> {
    const compiledGraph = this.graph.compile()
    return await compiledGraph.invoke(initialState as WorkflowState)
  }

  async getVendorStatus() {
    return await this.vendorRouter.getVendorStatus()
  }

  async getBrandStatus(brandId: string) {
    return await this.brandBrain.getBrandStatus(brandId)
  }
}
