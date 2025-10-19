'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Users, 
  Target, 
  Clock,
  Zap,
  Brain,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Eye,
  MousePointer,
  Heart,
  Star
} from 'lucide-react'

interface AnalyticsData {
  overview: {
    totalCampaigns: number
    activeAgents: number
    successRate: number
    averageTime: number
    totalRevenue: number
    conversionRate: number
  }
  performance: {
    campaigns: Array<{
      id: string
      name: string
      status: 'completed' | 'running' | 'pending' | 'failed'
      performance: number
      impressions: number
      clicks: number
      conversions: number
      revenue: number
      startDate: string
      endDate?: string
    }>
  }
  agents: Array<{
    id: string
    name: string
    type: string
    metrics: {
      cpu: number
      memory: number
      requests: number
      successRate: number
    }
  }>
  trends: {
    daily: Array<{ date: string; value: number }>
    weekly: Array<{ week: string; value: number }>
    monthly: Array<{ month: string; value: number }>
  }
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>({
    overview: {
      totalCampaigns: 24,
      activeAgents: 8,
      successRate: 92,
      averageTime: 3.2,
      totalRevenue: 125000,
      conversionRate: 4.8
    },
    performance: {
      campaigns: [
        {
          id: '1',
          name: 'Nike Summer 2025',
          status: 'completed',
          performance: 95,
          impressions: 1250000,
          clicks: 45000,
          conversions: 2100,
          revenue: 45000,
          startDate: '2025-01-15',
          endDate: '2025-02-15'
        },
        {
          id: '2',
          name: 'Apple iPhone 16',
          status: 'running',
          performance: 88,
          impressions: 890000,
          clicks: 32000,
          conversions: 1500,
          revenue: 32000,
          startDate: '2025-02-01'
        },
        {
          id: '3',
          name: 'Tesla Model Y',
          status: 'pending',
          performance: 0,
          impressions: 0,
          clicks: 0,
          conversions: 0,
          revenue: 0,
          startDate: '2025-02-20'
        }
      ]
    },
    agents: [
      {
        id: '1',
        name: 'Brief Generator',
        type: 'Marketing',
        metrics: { cpu: 45, memory: 60, requests: 150, successRate: 95 }
      },
      {
        id: '2',
        name: 'Image Artisan',
        type: 'Creative',
        metrics: { cpu: 78, memory: 85, requests: 89, successRate: 88 }
      },
      {
        id: '3',
        name: 'Brand Brain',
        type: 'Strategy',
        metrics: { cpu: 32, memory: 45, requests: 203, successRate: 92 }
      }
    ],
    trends: {
      daily: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: Math.floor(Math.random() * 1000) + 500
      })),
      weekly: Array.from({ length: 12 }, (_, i) => ({
        week: `Semaine ${i + 1}`,
        value: Math.floor(Math.random() * 5000) + 2000
      })),
      monthly: Array.from({ length: 6 }, (_, i) => ({
        month: new Date(Date.now() - (5 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { month: 'long' }),
        value: Math.floor(Math.random() * 20000) + 10000
      }))
    }
  })

  const [selectedTimeframe, setSelectedTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [isLoading, setIsLoading] = useState(false)

  // Simulation des métriques en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        agents: prev.agents.map(agent => ({
          ...agent,
          metrics: {
            ...agent.metrics,
            cpu: Math.random() * 100,
            memory: Math.random() * 100,
            requests: Math.floor(Math.random() * 1000)
          }
        }))
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics SOTA 2025</h1>
          <p className="text-gray-600 mt-2">
            Métriques avancées et insights en temps réel
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleRefresh}
            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </button>
          
          <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Campagnes</p>
                <p className="text-2xl font-bold">{data.overview.totalCampaigns}</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+12%</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Agents Actifs</p>
                <p className="text-2xl font-bold">{data.overview.activeAgents}</p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+8%</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taux de Succès</p>
                <p className="text-2xl font-bold">{data.overview.successRate}%</p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${data.overview.successRate}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Temps Moyen</p>
                <p className="text-2xl font-bold">{data.overview.averageTime}s</p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingDown className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">-15%</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus</p>
                <p className="text-2xl font-bold">{formatCurrency(data.overview.totalRevenue)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+25%</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion</p>
                <p className="text-2xl font-bold">{data.overview.conversionRate}%</p>
              </div>
              <MousePointer className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+3%</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaigns Performance */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Performance des Campagnes</h3>
            </div>
            <div className="space-y-4">
              {data.performance.campaigns.map((campaign, index) => (
                <div key={campaign.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{campaign.name}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      campaign.status === 'completed' ? 'bg-green-100 text-green-800' :
                      campaign.status === 'running' ? 'bg-blue-100 text-blue-800' :
                      campaign.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Performance</span>
                      <span>{campaign.performance}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${campaign.performance}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Impressions</span>
                      <p className="font-semibold">{formatNumber(campaign.impressions)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Clics</span>
                      <p className="font-semibold">{formatNumber(campaign.clicks)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Conversions</span>
                      <p className="font-semibold">{formatNumber(campaign.conversions)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Revenus</span>
                      <p className="font-semibold">{formatCurrency(campaign.revenue)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Agents Metrics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Métriques des Agents</h3>
            </div>
            <div className="space-y-4">
              {data.agents.map((agent) => (
                <div key={agent.id} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{agent.name}</h4>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium">
                      {agent.type}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">CPU</span>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${agent.metrics.cpu}%` }}
                          />
                        </div>
                        <span className="font-semibold">{agent.metrics.cpu.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">RAM</span>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${agent.metrics.memory}%` }}
                          />
                        </div>
                        <span className="font-semibold">{agent.metrics.memory.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Requêtes</span>
                      <p className="font-semibold">{agent.metrics.requests}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Succès</span>
                      <p className="font-semibold">{agent.metrics.successRate}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Timeframe Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <LineChart className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Tendances</h3>
          </div>
          <div className="flex space-x-2 mb-4">
            {(['daily', 'weekly', 'monthly'] as const).map((timeframe) => (
              <button
                key={timeframe}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTimeframe === timeframe 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedTimeframe(timeframe)}
              >
                {timeframe === 'daily' ? 'Quotidien' :
                 timeframe === 'weekly' ? 'Hebdomadaire' : 'Mensuel'}
              </button>
            ))}
          </div>
          
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Graphique des tendances</p>
              <p className="text-sm text-gray-500">
                {data.trends[selectedTimeframe].length} points de données
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}