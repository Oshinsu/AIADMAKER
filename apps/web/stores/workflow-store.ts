import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface WorkflowStep {
  id: string
  name: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  completed: boolean
  active: boolean
  duration?: number
  error?: string
}

export interface Workflow {
  id: string
  name: string
  description: string
  status: 'pending' | 'running' | 'paused' | 'completed' | 'failed'
  progress: number
  steps: WorkflowStep[]
  createdAt: string
  updatedAt: string
  createdBy: string
  tags: string[]
  metadata: Record<string, any>
}

interface WorkflowStore {
  workflows: Workflow[]
  currentWorkflow: Workflow | null
  isLoading: boolean
  error: string | null
  
  // Actions
  createWorkflow: (workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateWorkflow: (id: string, updates: Partial<Workflow>) => void
  deleteWorkflow: (id: string) => void
  setCurrentWorkflow: (id: string | null) => void
  updateWorkflowStatus: (id: string, status: Workflow['status']) => void
  updateWorkflowProgress: (id: string, progress: number) => void
  updateStepStatus: (workflowId: string, stepId: string, status: WorkflowStep['status']) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Additional properties for compatibility
  nodes: any[]
  edges: any[]
  addEdge: (edge: any) => void
  updateNode: (nodeId: string, updates: any) => void
  saveWorkflow: () => void
  runWorkflow: () => void
  exportWorkflow: () => void
  
  // React Flow specific properties
  onNodesChange: (changes: any) => void
  onEdgesChange: (changes: any) => void
}

export const useWorkflowStore = create<WorkflowStore>()(
  devtools(
    persist(
      (set, get) => ({
        workflows: [
          {
            id: '1',
            name: 'Campagne Nike Air Max',
            description: 'Création de publicités pour la nouvelle collection Nike Air Max',
            status: 'running',
            progress: 65,
            steps: [
              { id: '1', name: 'Génération Brief', status: 'completed', completed: true, active: false },
              { id: '2', name: 'Évaluation Brief', status: 'completed', completed: true, active: false },
              { id: '3', name: 'Optimisation Prompts', status: 'running', completed: false, active: true },
              { id: '4', name: 'Génération Images', status: 'pending', completed: false, active: false },
              { id: '5', name: 'Animation Vidéo', status: 'pending', completed: false, active: false },
              { id: '6', name: 'Montage Final', status: 'pending', completed: false, active: false }
            ],
            createdAt: '2025-01-15T10:30:00Z',
            updatedAt: '2025-01-15T11:45:00Z',
            createdBy: 'user-1',
            tags: ['nike', 'sport', 'shoes'],
            metadata: { brand: 'Nike', campaign: 'Air Max 2025' }
          },
          {
            id: '2',
            name: 'Publicité iPhone 15',
            description: 'Création de publicités pour le nouvel iPhone 15',
            status: 'completed',
            progress: 100,
            steps: [
              { id: '1', name: 'Génération Brief', status: 'completed', completed: true, active: false },
              { id: '2', name: 'Évaluation Brief', status: 'completed', completed: true, active: false },
              { id: '3', name: 'Optimisation Prompts', status: 'completed', completed: true, active: false },
              { id: '4', name: 'Génération Images', status: 'completed', completed: true, active: false },
              { id: '5', name: 'Animation Vidéo', status: 'completed', completed: true, active: false },
              { id: '6', name: 'Montage Final', status: 'completed', completed: true, active: false }
            ],
            createdAt: '2025-01-14T09:15:00Z',
            updatedAt: '2025-01-14T16:30:00Z',
            createdBy: 'user-1',
            tags: ['apple', 'iphone', 'tech'],
            metadata: { brand: 'Apple', campaign: 'iPhone 15 Launch' }
          },
          {
            id: '3',
            name: 'Campagne Tesla Model Y',
            description: 'Publicités pour le Tesla Model Y',
            status: 'failed',
            progress: 30,
            steps: [
              { id: '1', name: 'Génération Brief', status: 'completed', completed: true, active: false },
              { id: '2', name: 'Évaluation Brief', status: 'failed', completed: false, active: false, error: 'Erreur de validation' },
              { id: '3', name: 'Optimisation Prompts', status: 'pending', completed: false, active: false },
              { id: '4', name: 'Génération Images', status: 'pending', completed: false, active: false },
              { id: '5', name: 'Animation Vidéo', status: 'pending', completed: false, active: false },
              { id: '6', name: 'Montage Final', status: 'pending', completed: false, active: false }
            ],
            createdAt: '2025-01-13T14:20:00Z',
            updatedAt: '2025-01-13T15:45:00Z',
            createdBy: 'user-2',
            tags: ['tesla', 'electric', 'car'],
            metadata: { brand: 'Tesla', campaign: 'Model Y 2025' }
          }
        ],
        currentWorkflow: null,
        isLoading: false,
        error: null,

        createWorkflow: (workflow) => {
          const newWorkflow: Workflow = {
            ...workflow,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          set((state) => ({
            workflows: [...state.workflows, newWorkflow]
          }))
        },

        updateWorkflow: (id, updates) => {
          set((state) => ({
            workflows: state.workflows.map(workflow =>
              workflow.id === id
                ? { ...workflow, ...updates, updatedAt: new Date().toISOString() }
                : workflow
            )
          }))
        },

        deleteWorkflow: (id) => {
          set((state) => ({
            workflows: state.workflows.filter(workflow => workflow.id !== id),
            currentWorkflow: state.currentWorkflow?.id === id ? null : state.currentWorkflow
          }))
        },

        setCurrentWorkflow: (id) => {
          const workflow = id ? get().workflows.find(w => w.id === id) : null
          set({ currentWorkflow: workflow || null })
        },

        updateWorkflowStatus: (id, status) => {
          set((state) => ({
            workflows: state.workflows.map(workflow =>
              workflow.id === id
                ? { ...workflow, status, updatedAt: new Date().toISOString() }
                : workflow
            )
          }))
        },

        updateWorkflowProgress: (id, progress) => {
          set((state) => ({
            workflows: state.workflows.map(workflow =>
              workflow.id === id
                ? { ...workflow, progress, updatedAt: new Date().toISOString() }
                : workflow
            )
          }))
        },

        updateStepStatus: (workflowId, stepId, status) => {
          set((state) => ({
            workflows: state.workflows.map(workflow =>
              workflow.id === workflowId
                ? {
                    ...workflow,
                    steps: workflow.steps.map(step =>
                      step.id === stepId
                        ? { ...step, status, completed: status === 'completed' }
                        : step
                    ),
                    updatedAt: new Date().toISOString()
                  }
                : workflow
            )
          }))
        },

        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error }),
        
        // Additional implementations for compatibility
        nodes: [],
        edges: [],
        addEdge: (edge) => set((state) => ({ edges: [...state.edges, edge] })),
        updateNode: (nodeId, updates) => set((state) => ({
          nodes: state.nodes.map(node => 
            node.id === nodeId ? { ...node, ...updates } : node
          )
        })),
        saveWorkflow: () => {
          console.log('Saving workflow...')
        },
        runWorkflow: () => {
          console.log('Running workflow...')
        },
        exportWorkflow: () => {
          console.log('Exporting workflow...')
        },
        
        // React Flow specific implementations
        onNodesChange: (changes) => {
          console.log('Nodes changed:', changes)
        },
        onEdgesChange: (changes) => {
          console.log('Edges changed:', changes)
        },
      }),
      {
        name: 'workflow-store',
        partialize: (state) => ({
          workflows: state.workflows,
          currentWorkflow: state.currentWorkflow
        })
      }
    ),
    { name: 'WorkflowStore' }
  )
)