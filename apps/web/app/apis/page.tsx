'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Settings, 
  Key, 
  Zap, 
  Shield, 
  Activity, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  ExternalLink,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react'

interface ApiConfig {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive' | 'error' | 'testing'
  category: 'ai' | 'video' | 'audio' | 'image' | 'storage' | 'analytics'
  apiKey: string
  baseUrl: string
  version: string
  lastUsed: string
  usage: {
    requests: number
    tokens: number
    cost: number
  }
  limits: {
    daily: number
    monthly: number
    rateLimit: number
  }
  features: string[]
  documentation: string
}

const API_CONFIGS: ApiConfig[] = [
  {
    id: 'openai',
    name: 'OpenAI GPT-4o',
    description: 'Modèle de langage avancé pour la génération de contenu et l\'analyse',
    status: 'active',
    category: 'ai',
    apiKey: 'sk-***',
    baseUrl: 'https://api.openai.com/v1',
    version: 'v4.60',
    lastUsed: '2025-10-15T10:30:00Z',
    usage: { requests: 1250, tokens: 45000, cost: 12.50 },
    limits: { daily: 10000, monthly: 300000, rateLimit: 60 },
    features: ['GPT-4o', 'Assistants API v2', 'Function Calling', 'Vision'],
    documentation: 'https://platform.openai.com/docs'
  },
  {
    id: 'gemini',
    name: 'Google Gemini 2.0',
    description: 'Modèle multimodal pour texte, images et analyse',
    status: 'active',
    category: 'ai',
    apiKey: 'AI***',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    version: 'v1beta',
    lastUsed: '2025-10-15T09:45:00Z',
    usage: { requests: 890, tokens: 32000, cost: 8.90 },
    limits: { daily: 5000, monthly: 150000, rateLimit: 30 },
    features: ['Multimodal', 'Vision', 'Code Generation', 'Safety'],
    documentation: 'https://ai.google.dev/docs'
  },
  {
    id: 'seedream',
    name: 'Seedream Video',
    description: 'Génération de vidéos IA de haute qualité',
    status: 'testing',
    category: 'video',
    apiKey: 'sd_***',
    baseUrl: 'https://api.seedream.ai/v1',
    version: 'v1',
    lastUsed: '2025-10-14T16:20:00Z',
    usage: { requests: 45, tokens: 0, cost: 25.00 },
    limits: { daily: 100, monthly: 3000, rateLimit: 10 },
    features: ['Video Generation', 'Style Transfer', 'HD Quality', 'Custom Duration'],
    documentation: 'https://docs.seedream.ai'
  },
  {
    id: 'kling',
    name: 'Kling AI',
    description: 'Génération de vidéos courtes avec styles variés',
    status: 'active',
    category: 'video',
    apiKey: 'kl_***',
    baseUrl: 'https://api.kling.ai/v1',
    version: 'v1',
    lastUsed: '2025-10-15T08:15:00Z',
    usage: { requests: 120, tokens: 0, cost: 18.00 },
    limits: { daily: 200, monthly: 6000, rateLimit: 15 },
    features: ['Short Videos', 'Multiple Styles', 'Fast Generation', 'Reference Images'],
    documentation: 'https://docs.kling.ai'
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs Voice',
    description: 'Synthèse vocale de haute qualité avec voix naturelles',
    status: 'active',
    category: 'audio',
    apiKey: 'el_***',
    baseUrl: 'https://api.elevenlabs.io/v1',
    version: 'v1',
    lastUsed: '2025-10-15T11:00:00Z',
    usage: { requests: 340, tokens: 0, cost: 15.20 },
    limits: { daily: 1000, monthly: 30000, rateLimit: 50 },
    features: ['Voice Cloning', 'Multiple Languages', 'Emotion Control', 'Real-time'],
    documentation: 'https://docs.elevenlabs.io'
  },
  {
    id: 'pinecone',
    name: 'Pinecone Vector DB',
    description: 'Base de données vectorielle pour la recherche sémantique',
    status: 'active',
    category: 'storage',
    apiKey: 'pc_***',
    baseUrl: 'https://api.pinecone.io',
    version: 'v1',
    lastUsed: '2025-10-15T07:30:00Z',
    usage: { requests: 2100, tokens: 0, cost: 5.50 },
    limits: { daily: 10000, monthly: 300000, rateLimit: 100 },
    features: ['Vector Search', 'Semantic Search', 'Real-time Updates', 'Scalable'],
    documentation: 'https://docs.pinecone.io'
  },
  {
    id: 'aws-s3',
    name: 'AWS S3 Storage',
    description: 'Stockage cloud pour les médias et fichiers',
    status: 'active',
    category: 'storage',
    apiKey: 'AKIA***',
    baseUrl: 'https://s3.amazonaws.com',
    version: 'v4',
    lastUsed: '2025-10-15T12:15:00Z',
    usage: { requests: 5600, tokens: 0, cost: 8.75 },
    limits: { daily: 50000, monthly: 1500000, rateLimit: 1000 },
    features: ['File Storage', 'CDN', 'Versioning', 'Security'],
    documentation: 'https://docs.aws.amazon.com/s3'
  }
]

export default function APIsPage() {
  const [apis, setApis] = useState<ApiConfig[]>(API_CONFIGS)
  const [selectedApi, setSelectedApi] = useState<string | null>(null)
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [testingApis, setTestingApis] = useState<Set<string>>(new Set())

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'testing':
        return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      case 'testing':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ai':
        return 'bg-purple-100 text-purple-800'
      case 'video':
        return 'bg-pink-100 text-pink-800'
      case 'audio':
        return 'bg-orange-100 text-orange-800'
      case 'image':
        return 'bg-blue-100 text-blue-800'
      case 'storage':
        return 'bg-gray-100 text-gray-800'
      case 'analytics':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const testApi = async (apiId: string) => {
    setTestingApis(prev => new Set(prev).add(apiId))
    
    // Simulation du test d'API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setApis(prev => prev.map(api => 
      api.id === apiId 
        ? { ...api, status: 'active' as const, lastUsed: new Date().toISOString() }
        : api
    ))
    
    setTestingApis(prev => {
      const newSet = new Set(prev)
      newSet.delete(apiId)
      return newSet
    })
  }

  const toggleApiKey = (apiId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [apiId]: !prev[apiId]
    }))
  }

  const copyApiKey = (apiKey: string) => {
    navigator.clipboard.writeText(apiKey)
  }

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">APIs & Connecteurs</h1>
          <p className="text-muted-foreground mt-2">
            Gestion centralisée de toutes les APIs nécessaires au fonctionnement des agents
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setSelectedApi(null)}>
            <Settings className="h-4 w-4 mr-2" />
            Configuration
          </Button>
          <Button>
            <Zap className="h-4 w-4 mr-2" />
            Test Global
          </Button>
        </div>
      </div>

      {/* Statistiques Globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">APIs Actives</p>
                <p className="text-2xl font-bold">{apis.filter(api => api.status === 'active').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">En Test</p>
                <p className="text-2xl font-bold">{apis.filter(api => api.status === 'testing').length}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Erreurs</p>
                <p className="text-2xl font-bold">{apis.filter(api => api.status === 'error').length}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Coût Total</p>
                <p className="text-2xl font-bold">${apis.reduce((sum, api) => sum + api.usage.cost, 0).toFixed(2)}</p>
              </div>
              <Shield className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des APIs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {apis.map((api) => (
          <Card key={api.id} className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedApi === api.id ? 'ring-2 ring-primary' : ''
          }`} onClick={() => setSelectedApi(selectedApi === api.id ? null : api.id)}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{api.name}</CardTitle>
                  <CardDescription className="text-sm">{api.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(api.status)}
                  <Badge className={getStatusColor(api.status)}>
                    {api.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Catégorie et Version */}
              <div className="flex items-center gap-2">
                <Badge className={getCategoryColor(api.category)}>
                  {api.category}
                </Badge>
                <Badge variant="outline">v{api.version}</Badge>
              </div>

              {/* Clé API */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Clé API</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleApiKey(api.id)
                      }}
                    >
                      {showKeys[api.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        copyApiKey(api.apiKey)
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="font-mono text-xs bg-muted p-2 rounded">
                  {showKeys[api.id] ? api.apiKey : '••••••••••••••••'}
                </div>
              </div>

              {/* Usage et Limites */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Usage Quotidien</span>
                  <span>{api.usage.requests} / {api.limits.daily}</span>
                </div>
                <Progress 
                  value={getUsagePercentage(api.usage.requests, api.limits.daily)} 
                  className="h-2"
                />
              </div>

              {/* Coût */}
              <div className="flex justify-between text-sm">
                <span>Coût ce mois</span>
                <span className="font-medium">${api.usage.cost.toFixed(2)}</span>
              </div>

              {/* Dernière utilisation */}
              <div className="text-xs text-muted-foreground">
                Dernière utilisation: {new Date(api.lastUsed).toLocaleString('fr-FR')}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    testApi(api.id)
                  }}
                  disabled={testingApis.has(api.id)}
                >
                  {testingApis.has(api.id) ? (
                    <Activity className="h-3 w-3 mr-1 animate-spin" />
                  ) : (
                    <Play className="h-3 w-3 mr-1" />
                  )}
                  {testingApis.has(api.id) ? 'Test...' : 'Tester'}
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(api.documentation, '_blank')
                  }}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Docs
                </Button>
              </div>

              {/* Fonctionnalités */}
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">Fonctionnalités:</span>
                <div className="flex flex-wrap gap-1">
                  {api.features.slice(0, 3).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {api.features.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{api.features.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Détails de l'API sélectionnée */}
      {selectedApi && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Configuration Détaillée</CardTitle>
            <CardDescription>
              Paramètres avancés pour {apis.find(api => api.id === selectedApi)?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">URL de Base</label>
                  <div className="font-mono text-sm bg-muted p-2 rounded mt-1">
                    {apis.find(api => api.id === selectedApi)?.baseUrl}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Limite de Taux</label>
                  <div className="text-sm bg-muted p-2 rounded mt-1">
                    {apis.find(api => api.id === selectedApi)?.limits.rateLimit} req/min
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Toutes les Fonctionnalités</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {apis.find(api => api.id === selectedApi)?.features.map((feature, index) => (
                    <Badge key={index} variant="outline">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
