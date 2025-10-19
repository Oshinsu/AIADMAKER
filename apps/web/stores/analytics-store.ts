import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface AgentPerformance {
  name: string
  time: number
  trend: 'up' | 'down'
  change: number
}

export interface SuccessByType {
  name: string
  rate: number
}

export interface ErrorAnalysis {
  type: string
  count: number
  percentage: number
}

export interface CostAnalysis {
  service: string
  amount: number
  percentage: number
  color: string
}

export interface RecentActivity {
  title: string
  description: string
  timestamp: string
  icon: 'success' | 'error' | 'info'
  iconBg: string
}

export interface Analytics {
  workflowsExecuted: number
  averageTime: string
  successRate: number
  totalCost: number
  agentPerformance: AgentPerformance[]
  successByType: SuccessByType[]
  errorAnalysis: ErrorAnalysis[]
  costAnalysis: CostAnalysis[]
  recentActivity: RecentActivity[]
}

interface AnalyticsStore {
  analytics: Analytics
  timeRange: string
  isLoading: boolean
  error: string | null
  
  // Actions
  setTimeRange: (range: string) => void
  refreshAnalytics: () => Promise<void>
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useAnalyticsStore = create<AnalyticsStore>()(
  devtools(
    persist(
      (set, get) => ({
        analytics: {
          workflowsExecuted: 1247,
          averageTime: '2.4m',
          successRate: 94.2,
          totalCost: 2847.50,
          agentPerformance: [
            { name: 'Générateur de Briefs', time: 2500, trend: 'down', change: 8 },
            { name: 'Évaluateur de Briefs', time: 1800, trend: 'down', change: 12 },
            { name: 'Artisan d\'Images', time: 15000, trend: 'up', change: 5 },
            { name: 'Animateur', time: 45000, trend: 'down', change: 15 },
            { name: 'Monteur', time: 30000, trend: 'up', change: 3 },
            { name: 'Générateur de Voix', time: 8000, trend: 'down', change: 10 }
          ],
          successByType: [
            { name: 'Images', rate: 96.5 },
            { name: 'Vidéos', rate: 92.3 },
            { name: 'Audio', rate: 89.7 },
            { name: 'Textes', rate: 98.1 }
          ],
          errorAnalysis: [
            { type: 'Timeout API', count: 45, percentage: 35 },
            { type: 'Erreur de validation', count: 32, percentage: 25 },
            { type: 'Quota dépassé', count: 28, percentage: 22 },
            { type: 'Erreur de génération', count: 23, percentage: 18 }
          ],
          costAnalysis: [
            { service: 'OpenAI GPT-4o', amount: 1247.30, percentage: 44, color: 'bg-blue-500' },
            { service: 'DALL-E 3', amount: 892.50, percentage: 31, color: 'bg-purple-500' },
            { service: 'ElevenLabs', amount: 456.20, percentage: 16, color: 'bg-green-500' },
            { service: 'Runway ML', amount: 251.50, percentage: 9, color: 'bg-orange-500' }
          ],
          recentActivity: [
            {
              title: 'Workflow Nike Air Max terminé',
              description: 'Campagne Nike Air Max générée avec succès',
              timestamp: 'Il y a 2 minutes',
              icon: 'success',
              iconBg: 'bg-green-100'
            },
            {
              title: 'Erreur dans le workflow Tesla',
              description: 'Échec de génération d\'image pour Tesla Model Y',
              timestamp: 'Il y a 15 minutes',
              icon: 'error',
              iconBg: 'bg-red-100'
            },
            {
              title: 'Nouveau workflow créé',
              description: 'Campagne iPhone 15 lancée',
              timestamp: 'Il y a 1 heure',
              icon: 'info',
              iconBg: 'bg-blue-100'
            },
            {
              title: 'Agent mis à jour',
              description: 'Générateur de voix mis à jour vers v1.2',
              timestamp: 'Il y a 2 heures',
              icon: 'info',
              iconBg: 'bg-blue-100'
            },
            {
              title: 'Workflow Apple terminé',
              description: 'Publicité iPhone 15 générée avec succès',
              timestamp: 'Il y a 3 heures',
              icon: 'success',
              iconBg: 'bg-green-100'
            }
          ]
        },
        timeRange: '30d',
        isLoading: false,
        error: null,

        setTimeRange: (range) => {
          set({ timeRange: range })
          // Simuler le rechargement des données
          get().refreshAnalytics()
        },

        refreshAnalytics: async () => {
          set({ isLoading: true, error: null })
          
          try {
            // Simuler le chargement des données
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // Mettre à jour les données selon la période
            const { timeRange } = get()
            const multiplier = timeRange === '7d' ? 0.3 : timeRange === '30d' ? 1 : timeRange === '90d' ? 2.5 : 4
            
            set((state) => ({
              analytics: {
                ...state.analytics,
                workflowsExecuted: Math.floor(1247 * multiplier),
                totalCost: Math.floor(2847.50 * multiplier * 100) / 100
              },
              isLoading: false
            }))
            
          } catch (error) {
            set({ 
              isLoading: false, 
              error: error instanceof Error ? error.message : 'Erreur lors du chargement des analytics' 
            })
          }
        },

        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error })
      }),
      {
        name: 'analytics-store',
        partialize: (state) => ({
          analytics: state.analytics,
          timeRange: state.timeRange
        })
      }
    ),
    { name: 'AnalyticsStore' }
  )
)
