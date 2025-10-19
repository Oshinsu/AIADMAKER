import { StateGraph, END, START } from 'langgraph'
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

export class WorkflowOrchestrator {
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

    // Add nodes
    this.graph.addNode('brief-generation', this.briefGenerationNode.bind(this))
    this.graph.addNode('brief-evaluation', this.briefEvaluationNode.bind(this))
    this.graph.addNode('prompt-optimization', this.promptOptimizationNode.bind(this))
    this.graph.addNode('image-generation', this.imageGenerationNode.bind(this))
    this.graph.addNode('video-animation', this.videoAnimationNode.bind(this))
    this.graph.addNode('video-editing', this.videoEditingNode.bind(this))
    this.graph.addNode('audio-generation', this.audioGenerationNode.bind(this))
    this.graph.addNode('spec-validation', this.specValidationNode.bind(this))
    this.graph.addNode('compliance-check', this.complianceCheckNode.bind(this))
    this.graph.addNode('human-approval', this.humanApprovalNode.bind(this))

    // Add edges
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
    this.graph.addEdge('prompt-optimization', 'image-generation')
    this.graph.addEdge('image-generation', 'video-animation')
    this.graph.addEdge('video-animation', 'video-editing')
    this.graph.addEdge('video-editing', 'audio-generation')
    this.graph.addEdge('audio-generation', 'spec-validation')
    this.graph.addEdge('spec-validation', 'compliance-check')
    this.graph.addConditionalEdges(
      'compliance-check',
      this.shouldRequireHumanApproval.bind(this),
      {
        'approve': 'human-approval',
        'auto-approve': END,
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
    this.graph.setEntryPoint('brief-generation')
  }

  private async briefGenerationNode(state: WorkflowState): Promise<Partial<WorkflowState>> {
    try {
      const agent = this.agents.get('brief-gen')
      const result = await agent.generateBriefs(state.metadata.inputs)
      
      return {
        currentStep: 'brief-generation',
        results: {
          ...state.results,
          'brief-generation': {
            agentId: 'brief-gen',
            status: 'success',
            data: result,
          },
        },
      }
    } catch (error) {
      return {
        currentStep: 'brief-generation',
        results: {
          ...state.results,
          'brief-generation': {
            agentId: 'brief-gen',
            status: 'error',
            error: error.message,
          },
        },
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
      const briefs = state.results['brief-generation']?.data
      const evaluation = await agent.evaluateBriefs(briefs)
      
      return {
        currentStep: 'brief-evaluation',
        results: {
          ...state.results,
          'brief-evaluation': {
            agentId: 'brief-judge',
            status: 'success',
            data: evaluation,
          },
        },
      }
    } catch (error) {
      return {
        currentStep: 'brief-evaluation',
        results: {
          ...state.results,
          'brief-evaluation': {
            agentId: 'brief-judge',
            status: 'error',
            error: error.message,
          },
        },
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
      const selectedBrief = state.results['brief-evaluation']?.data?.selectedBrief
      const result = await agent.optimizePrompts(selectedBrief)
      
      return {
        currentStep: 'prompt-optimization',
        results: {
          ...state.results,
          'prompt-optimization': {
            agentId: 'prompt-smith',
            status: 'success',
            data: result,
          },
        },
      }
    } catch (error) {
      return {
        currentStep: 'prompt-optimization',
        results: {
          ...state.results,
          'prompt-optimization': {
            agentId: 'prompt-smith',
            status: 'error',
            error: error.message,
          },
        },
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
      const prompts = state.results['prompt-optimization']?.data
      const result = await agent.generateImages(prompts)
      
      return {
        currentStep: 'image-generation',
        results: {
          ...state.results,
          'image-generation': {
            agentId: 'image-artisan',
            status: 'success',
            data: result,
          },
        },
      }
    } catch (error) {
      return {
        currentStep: 'image-generation',
        results: {
          ...state.results,
          'image-generation': {
            agentId: 'image-artisan',
            status: 'error',
            error: error.message,
          },
        },
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
      const images = state.results['image-generation']?.data
      const result = await agent.animateImages(images)
      
      return {
        currentStep: 'video-animation',
        results: {
          ...state.results,
          'video-animation': {
            agentId: 'animator',
            status: 'success',
            data: result,
          },
        },
      }
    } catch (error) {
      return {
        currentStep: 'video-animation',
        results: {
          ...state.results,
          'video-animation': {
            agentId: 'animator',
            status: 'error',
            error: error.message,
          },
        },
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
      const videos = state.results['video-animation']?.data
      const result = await agent.editVideos(videos)
      
      return {
        currentStep: 'video-editing',
        results: {
          ...state.results,
          'video-editing': {
            agentId: 'editor',
            status: 'success',
            data: result,
          },
        },
      }
    } catch (error) {
      return {
        currentStep: 'video-editing',
        results: {
          ...state.results,
          'video-editing': {
            agentId: 'editor',
            status: 'error',
            error: error.message,
          },
        },
        errors: {
          ...state.errors,
          'video-editing': error.message,
        },
      }
    }
  }

  private async audioGenerationNode(state: WorkflowState): Promise<Partial<WorkflowState>> {
    try {
      const musicAgent = this.agents.get('music-gen')
      const voiceAgent = this.agents.get('voice-gen')
      
      const musicResult = await musicAgent.generateMusic(state.metadata.inputs)
      const voiceResult = await voiceAgent.generateVoice(state.metadata.inputs)
      
      return {
        currentStep: 'audio-generation',
        results: {
          ...state.results,
          'audio-generation': {
            agentId: 'audio-generation',
            status: 'success',
            data: {
              music: musicResult,
              voice: voiceResult,
            },
          },
        },
      }
    } catch (error) {
      return {
        currentStep: 'audio-generation',
        results: {
          ...state.results,
          'audio-generation': {
            agentId: 'audio-generation',
            status: 'error',
            error: error.message,
          },
        },
        errors: {
          ...state.errors,
          'audio-generation': error.message,
        },
      }
    }
  }

  private async specValidationNode(state: WorkflowState): Promise<Partial<WorkflowState>> {
    try {
      const agent = this.agents.get('spec-check')
      const assets = {
        images: state.results['image-generation']?.data,
        videos: state.results['video-editing']?.data,
        audio: state.results['audio-generation']?.data,
      }
      const result = await agent.validateSpecs(assets)
      
      return {
        currentStep: 'spec-validation',
        results: {
          ...state.results,
          'spec-validation': {
            agentId: 'spec-check',
            status: 'success',
            data: result,
          },
        },
      }
    } catch (error) {
      return {
        currentStep: 'spec-validation',
        results: {
          ...state.results,
          'spec-validation': {
            agentId: 'spec-check',
            status: 'error',
            error: error.message,
          },
        },
        errors: {
          ...state.errors,
          'spec-validation': error.message,
        },
      }
    }
  }

  private async complianceCheckNode(state: WorkflowState): Promise<Partial<WorkflowState>> {
    try {
      const agent = this.agents.get('compliance')
      const assets = {
        images: state.results['image-generation']?.data,
        videos: state.results['video-editing']?.data,
        audio: state.results['audio-generation']?.data,
      }
      const result = await agent.checkCompliance(assets)
      
      return {
        currentStep: 'compliance-check',
        results: {
          ...state.results,
          'compliance-check': {
            agentId: 'compliance',
            status: 'success',
            data: result,
          },
        },
      }
    } catch (error) {
      return {
        currentStep: 'compliance-check',
        results: {
          ...state.results,
          'compliance-check': {
            agentId: 'compliance',
            status: 'error',
            error: error.message,
          },
        },
        errors: {
          ...state.errors,
          'compliance-check': error.message,
        },
      }
    }
  }

  private async humanApprovalNode(state: WorkflowState): Promise<Partial<WorkflowState>> {
    // This would integrate with Slack/Notion for human approval
    return {
      currentStep: 'human-approval',
      status: 'pending',
    }
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
    const compliance = state.results['compliance-check']
    if (!compliance || compliance.status === 'error') {
      return 'approve'
    }
    
    const riskLevel = compliance.data?.riskLevel
    if (riskLevel === 'high') {
      return 'approve'
    }
    
    return 'auto-approve'
  }

  private getHumanApprovalResult(state: WorkflowState): string {
    // This would check the approval status from Slack/Notion
    const approval = state.metadata.humanApproval
    if (approval === 'approved') return 'approved'
    if (approval === 'rejected') return 'rejected'
    return 'pending'
  }

  async executeWorkflow(initialState: Partial<WorkflowState>): Promise<WorkflowState> {
    const compiledGraph = this.graph.compile()
    return await compiledGraph.invoke(initialState as WorkflowState)
  }
}
