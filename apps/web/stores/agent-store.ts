import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface Agent {
  id: string
  name: string
  type: string
  status: 'idle' | 'running' | 'completed' | 'error'
  lastRun?: Date
  performance: {
    successRate: number
    averageTime: number
    totalRuns: number
  }
  metrics: {
    cpu: number
    memory: number
    requests: number
  }
}

export interface AgentState {
  agents: Agent[]
  selectedAgent: string | null
  isLoading: boolean
  error: string | null
  
  // Actions
  setAgents: (agents: Agent[]) => void
  addAgent: (agent: Agent) => void
  updateAgent: (id: string, updates: Partial<Agent>) => void
  deleteAgent: (id: string) => void
  selectAgent: (id: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Agent operations
  startAgent: (id: string) => Promise<void>
  stopAgent: (id: string) => Promise<void>
  restartAgent: (id: string) => Promise<void>
  
  // Metrics
  updateMetrics: (id: string, metrics: Partial<Agent['metrics']>) => void
  updatePerformance: (id: string, performance: Partial<Agent['performance']>) => void
}

export const useAgentStore = create<AgentState>()(
  devtools(
    (set, get) => ({
      agents: [],
      selectedAgent: null,
      isLoading: false,
      error: null,

      setAgents: (agents) => set({ agents }),
      
      addAgent: (agent) => set((state) => ({
        agents: [...state.agents, agent]
      })),
      
      updateAgent: (id, updates) => set((state) => ({
        agents: state.agents.map(agent =>
          agent.id === id ? { ...agent, ...updates } : agent
        )
      })),
      
      deleteAgent: (id) => set((state) => ({
        agents: state.agents.filter(agent => agent.id !== id)
      })),
      
      selectAgent: (id) => set({ selectedAgent: id }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),

      startAgent: async (id) => {
        set({ isLoading: true, error: null })
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          set((state) => ({
            agents: state.agents.map(agent =>
              agent.id === id 
                ? { ...agent, status: 'running', lastRun: new Date() }
                : agent
            ),
            isLoading: false
          }))
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to start agent',
            isLoading: false 
          })
        }
      },

      stopAgent: async (id) => {
        set({ isLoading: true, error: null })
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500))
          
          set((state) => ({
            agents: state.agents.map(agent =>
              agent.id === id 
                ? { ...agent, status: 'idle' }
                : agent
            ),
            isLoading: false
          }))
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to stop agent',
            isLoading: false 
          })
        }
      },

      restartAgent: async (id) => {
        const { stopAgent, startAgent } = get()
        await stopAgent(id)
        await startAgent(id)
      },

      updateMetrics: (id, metrics) => set((state) => ({
        agents: state.agents.map(agent =>
          agent.id === id 
            ? { ...agent, metrics: { ...agent.metrics, ...metrics } }
            : agent
        )
      })),

      updatePerformance: (id, performance) => set((state) => ({
        agents: state.agents.map(agent =>
          agent.id === id 
            ? { ...agent, performance: { ...agent.performance, ...performance } }
            : agent
        )
      }))
    }),
    {
      name: 'agent-store',
    }
  )
)