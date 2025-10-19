import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface Agent {
  id: string
  name: string
  description: string
  type: 'generator' | 'evaluator' | 'transformer' | 'validator'
  status: 'active' | 'idle' | 'error' | 'maintenance'
  tasksCompleted: number
  averageTime: number
  errors: number
  uptime: number
  lastActivity: string
  metadata: Record<string, any>
}

interface AgentStore {
  agents: Agent[]
  selectedAgent: Agent | null
  isLoading: boolean
  error: string | null
  
  // Actions
  updateAgentStatus: (id: string, status: Agent['status']) => void
  updateAgentMetrics: (id: string, metrics: Partial<Pick<Agent, 'tasksCompleted' | 'averageTime' | 'errors' | 'uptime'>>) => void
  setSelectedAgent: (id: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useAgentStore = create<AgentStore>()(
  devtools(
    persist(
      (set, get) => ({
        agents: [
          {
            id: 'brief-gen',
            name: 'Générateur de Briefs',
            description: 'Génère des briefs créatifs complets et percutants',
            type: 'generator',
            status: 'active',
            tasksCompleted: 1247,
            averageTime: 2500,
            errors: 12,
            uptime: 99.2,
            lastActivity: 'Il y a 2 minutes',
            metadata: { model: 'gpt-4o', version: '1.0' }
          },
          {
            id: 'brief-judge',
            name: 'Évaluateur de Briefs',
            description: 'Évalue et juge la qualité des briefs générés',
            type: 'evaluator',
            status: 'active',
            tasksCompleted: 1189,
            averageTime: 1800,
            errors: 8,
            uptime: 98.8,
            lastActivity: 'Il y a 5 minutes',
            metadata: { model: 'claude-3.5-sonnet', version: '1.0' }
          },
          {
            id: 'prompt-smith',
            name: 'Optimiseur de Prompts',
            description: 'Optimise les prompts pour maximiser la qualité des générations',
            type: 'transformer',
            status: 'active',
            tasksCompleted: 2156,
            averageTime: 1200,
            errors: 15,
            uptime: 99.1,
            lastActivity: 'Il y a 1 minute',
            metadata: { model: 'gpt-4o', version: '1.0' }
          },
          {
            id: 'image-artisan',
            name: 'Artisan d\'Images',
            description: 'Génère des images de haute qualité pour les publicités',
            type: 'generator',
            status: 'active',
            tasksCompleted: 3421,
            averageTime: 15000,
            errors: 45,
            uptime: 97.5,
            lastActivity: 'Il y a 3 minutes',
            metadata: { model: 'dall-e-3', version: '1.0' }
          },
          {
            id: 'animator',
            name: 'Animateur',
            description: 'Crée des animations et des vidéos dynamiques',
            type: 'generator',
            status: 'idle',
            tasksCompleted: 892,
            averageTime: 45000,
            errors: 23,
            uptime: 95.8,
            lastActivity: 'Il y a 15 minutes',
            metadata: { model: 'runway-ml', version: '1.0' }
          },
          {
            id: 'editor',
            name: 'Monteur',
            description: 'Effectue le montage final des vidéos',
            type: 'transformer',
            status: 'active',
            tasksCompleted: 1567,
            averageTime: 30000,
            errors: 18,
            uptime: 98.2,
            lastActivity: 'Il y a 4 minutes',
            metadata: { model: 'ffmpeg', version: '1.0' }
          },
          {
            id: 'music-gen',
            name: 'Générateur de Musique',
            description: 'Crée des musiques et jingles pour les publicités',
            type: 'generator',
            status: 'maintenance',
            tasksCompleted: 634,
            averageTime: 20000,
            errors: 7,
            uptime: 96.5,
            lastActivity: 'Il y a 1 heure',
            metadata: { model: 'suno', version: '1.0' }
          },
          {
            id: 'voice-gen',
            name: 'Générateur de Voix',
            description: 'Génère des voix off et narrations',
            type: 'generator',
            status: 'active',
            tasksCompleted: 2789,
            averageTime: 8000,
            errors: 32,
            uptime: 98.9,
            lastActivity: 'Il y a 2 minutes',
            metadata: { model: 'elevenlabs', version: '1.0' }
          },
          {
            id: 'spec-check',
            name: 'Vérificateur de Spécifications',
            description: 'Vérifie la conformité des créations aux spécifications',
            type: 'validator',
            status: 'active',
            tasksCompleted: 4123,
            averageTime: 5000,
            errors: 28,
            uptime: 99.3,
            lastActivity: 'Il y a 1 minute',
            metadata: { model: 'custom', version: '1.0' }
          },
          {
            id: 'compliance',
            name: 'Agent de Conformité',
            description: 'Vérifie la conformité légale et réglementaire',
            type: 'validator',
            status: 'error',
            tasksCompleted: 1876,
            averageTime: 12000,
            errors: 156,
            uptime: 89.2,
            lastActivity: 'Il y a 30 minutes',
            metadata: { model: 'gpt-4o', version: '1.0' }
          }
        ],
        selectedAgent: null,
        isLoading: false,
        error: null,

        updateAgentStatus: (id, status) => {
          set((state) => ({
            agents: state.agents.map(agent =>
              agent.id === id
                ? { ...agent, status, lastActivity: 'Maintenant' }
                : agent
            )
          }))
        },

        updateAgentMetrics: (id, metrics) => {
          set((state) => ({
            agents: state.agents.map(agent =>
              agent.id === id
                ? { ...agent, ...metrics, lastActivity: 'Maintenant' }
                : agent
            )
          }))
        },

        setSelectedAgent: (id) => {
          const agent = id ? get().agents.find(a => a.id === id) : null
          set({ selectedAgent: agent || null })
        },

        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error })
      }),
      {
        name: 'agent-store',
        partialize: (state) => ({
          agents: state.agents,
          selectedAgent: state.selectedAgent
        })
      }
    ),
    { name: 'AgentStore' }
  )
)
