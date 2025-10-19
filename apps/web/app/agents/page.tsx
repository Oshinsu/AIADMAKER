'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bot, 
  Brain, 
  Image, 
  Video, 
  Music, 
  Mic, 
  CheckCircle, 
  Palette,
  Megaphone,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Activity,
  TrendingUp,
  Clock,
  Zap,
  Shield,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'

const agentIcons = {
  'BriefGenerator': Brain,
  'ImageArtisan': Palette,
  'Animator': Video,
  'MusicGenerator': Music,
  'VoiceGenerator': Mic,
  'BrandBrain': Shield,
  'CreativeEvaluator': TrendingUp,
  'PromptSmith': Zap,
  'Editor': Settings,
  'Compliance': CheckCircle
}

const statusColors = {
  idle: 'bg-gray-100 text-gray-800',
  running: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  error: 'bg-red-100 text-red-800'
}

const statusIcons = {
  idle: Clock,
  running: Activity,
  completed: CheckCircle,
  error: AlertTriangle
}

export default function AgentsPage() {
  const [agents, setAgents] = useState([
    {
      id: '1',
      name: 'Brief Generator',
      type: 'BriefGenerator',
      status: 'idle' as 'idle' | 'running' | 'completed' | 'error',
      performance: { successRate: 95, averageTime: 2.3, totalRuns: 150 },
      metrics: { cpu: 0, memory: 0, requests: 0 },
      lastRun: new Date()
    },
    {
      id: '2', 
      name: 'Image Artisan',
      type: 'ImageArtisan',
      status: 'running' as 'idle' | 'running' | 'completed' | 'error',
      performance: { successRate: 88, averageTime: 5.7, totalRuns: 89 },
      metrics: { cpu: 78, memory: 85, requests: 89 },
      lastRun: new Date()
    },
    {
      id: '3',
      name: 'Brand Brain',
      type: 'BrandBrain',
      status: 'completed' as 'idle' | 'running' | 'completed' | 'error',
      performance: { successRate: 92, averageTime: 3.1, totalRuns: 203 },
      metrics: { cpu: 32, memory: 45, requests: 203 },
      lastRun: new Date()
    },
    {
      id: '4',
      name: 'Prompt Smith',
      type: 'PromptSmith',
      status: 'idle' as 'idle' | 'running' | 'completed' | 'error',
      performance: { successRate: 90, averageTime: 1.8, totalRuns: 156 },
      metrics: { cpu: 0, memory: 0, requests: 0 },
      lastRun: new Date()
    },
    {
      id: '5',
      name: 'Animator',
      type: 'Animator',
      status: 'running' as 'idle' | 'running' | 'completed' | 'error',
      performance: { successRate: 85, averageTime: 8.2, totalRuns: 67 },
      metrics: { cpu: 92, memory: 78, requests: 67 },
      lastRun: new Date()
    },
    {
      id: '6',
      name: 'Creative Evaluator',
      type: 'CreativeEvaluator',
      status: 'completed' as 'idle' | 'running' | 'completed' | 'error',
      performance: { successRate: 94, averageTime: 2.1, totalRuns: 189 },
      metrics: { cpu: 28, memory: 35, requests: 189 },
      lastRun: new Date()
    }
  ])

  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Simulation des métriques en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        if (agent.status === 'running') {
          return {
            ...agent,
            metrics: {
              cpu: Math.random() * 100,
              memory: Math.random() * 100,
              requests: Math.floor(Math.random() * 1000)
            }
          }
        }
        return agent
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const handleAgentAction = async (agentId: string, action: 'start' | 'stop' | 'restart') => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setAgents(prev => prev.map(agent => {
        if (agent.id === agentId) {
          switch (action) {
            case 'start':
              return { ...agent, status: 'running', lastRun: new Date() }
            case 'stop':
              return { ...agent, status: 'idle' }
            case 'restart':
              return { ...agent, status: 'running', lastRun: new Date() }
            default:
              return agent
          }
        }
        return agent
      }))
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update agent')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Agents IA SOTA 2025</h1>
          <p className="text-gray-600 mt-2">
            Orchestration avancée des agents IA pour la création publicitaire
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">
              {agents.filter(a => a.status === 'running').length} actifs
            </span>
          </div>
          
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2"
        >
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <span className="text-red-800">{error}</span>
        </motion.div>
      )}

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {agents.map((agent, index) => {
            const Icon = agentIcons[agent.type as keyof typeof agentIcons] || Bot
            const StatusIcon = statusIcons[agent.status]
            
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div 
                  className={`bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer ${
                    selectedAgent === agent.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedAgent(agent.id)}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        agent.status === 'running' ? 'bg-blue-100' :
                        agent.status === 'completed' ? 'bg-green-100' :
                        agent.status === 'error' ? 'bg-red-100' :
                        'bg-gray-100'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          agent.status === 'running' ? 'text-blue-600' :
                          agent.status === 'completed' ? 'text-green-600' :
                          agent.status === 'error' ? 'text-red-600' :
                          'text-gray-600'
                        }`} />
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold">{agent.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">
                          {agent.type} Agent
                        </p>
                      </div>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${statusColors[agent.status]}`}>
                      <StatusIcon className="w-3 h-3" />
                      <span className="capitalize">{agent.status}</span>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Taux de succès</span>
                      <span className="text-sm font-bold">{agent.performance.successRate}%</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${agent.performance.successRate}%` }}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Temps moyen</span>
                        <p className="font-semibold">{agent.performance.averageTime}s</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Exécutions</span>
                        <p className="font-semibold">{agent.performance.totalRuns}</p>
                      </div>
                    </div>
                  </div>

                  {/* Real-time Metrics */}
                  {agent.status === 'running' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-2 p-3 bg-blue-50 rounded-lg mb-4"
                    >
                      <div className="flex justify-between text-xs">
                        <span>CPU: {agent.metrics.cpu.toFixed(1)}%</span>
                        <span>RAM: {agent.metrics.memory.toFixed(1)}%</span>
                        <span>Req: {agent.metrics.requests}</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {agent.status === 'idle' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAgentAction(agent.id, 'start')
                        }}
                        className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        disabled={isLoading}
                      >
                        <Play className="w-4 h-4" />
                        <span>Démarrer</span>
                      </button>
                    ) : agent.status === 'running' ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAgentAction(agent.id, 'stop')
                          }}
                          className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                          disabled={isLoading}
                        >
                          <Pause className="w-4 h-4" />
                          <span>Pause</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAgentAction(agent.id, 'restart')
                          }}
                          className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                          disabled={isLoading}
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAgentAction(agent.id, 'start')
                        }}
                        className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        disabled={isLoading}
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Relancer</span>
                      </button>
                    )}
                  </div>

                  {/* Last Run Info */}
                  {agent.lastRun && (
                    <div className="text-xs text-gray-500 flex items-center space-x-1 mt-3">
                      <Clock className="w-3 h-3" />
                      <span>
                        Dernière exécution: {new Date(agent.lastRun).toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {agents.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Aucun agent configuré
          </h3>
          <p className="text-gray-500 mb-4">
            Configurez vos premiers agents IA pour commencer
          </p>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto">
            <Settings className="w-4 h-4" />
            <span>Configurer les agents</span>
          </button>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Chargement...</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}