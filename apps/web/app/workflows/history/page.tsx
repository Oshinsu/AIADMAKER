'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  History, 
  Filter,
  Download,
  Eye,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react'

const historyItems = [
  {
    id: '1',
    name: 'Campagne Nike Q1 2025',
    status: 'completed',
    startedAt: '2025-01-15T10:30:00Z',
    completedAt: '2025-01-15T10:45:00Z',
    duration: '15 min',
    executions: 12,
    successRate: 95,
    output: '3 images, 2 vidéos, 1 audio',
    agents: ['BriefGen', 'ImageArtisan', 'Editor']
  },
  {
    id: '2',
    name: 'Apple Product Launch',
    status: 'failed',
    startedAt: '2025-01-14T14:20:00Z',
    completedAt: '2025-01-14T14:35:00Z',
    duration: '15 min',
    executions: 8,
    successRate: 0,
    output: 'Erreur: Agent ImageArtisan non disponible',
    agents: ['BriefGen', 'ImageArtisan', 'Compliance']
  },
  {
    id: '3',
    name: 'Tesla Sustainability Campaign',
    status: 'completed',
    startedAt: '2025-01-13T09:15:00Z',
    completedAt: '2025-01-13T09:45:00Z',
    duration: '30 min',
    executions: 15,
    successRate: 92,
    output: '5 images, 3 vidéos, 2 audios',
    agents: ['BriefJudge', 'Music', 'Voice']
  },
  {
    id: '4',
    name: 'McDonald\'s Summer Campaign',
    status: 'running',
    startedAt: '2025-01-15T16:00:00Z',
    completedAt: null,
    duration: 'En cours...',
    executions: 6,
    successRate: 83,
    output: '2 images générées',
    agents: ['PromptSmith', 'Animator']
  }
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case 'failed':
      return <XCircle className="h-4 w-4 text-red-500" />
    case 'running':
      return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-500" />
    default:
      return <AlertTriangle className="h-4 w-4 text-gray-500" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'failed':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'running':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

export default function HistoryPage() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')

  const filteredItems = filter === 'all' 
    ? historyItems 
    : historyItems.filter(item => item.status === filter)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Historique des Workflows
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Consultez l'historique complet de vos workflows
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          Tous ({historyItems.length})
        </Button>
        <Button
          variant={filter === 'completed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('completed')}
        >
          Terminés ({historyItems.filter(item => item.status === 'completed').length})
        </Button>
        <Button
          variant={filter === 'failed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('failed')}
        >
          Échecs ({historyItems.filter(item => item.status === 'failed').length})
        </Button>
        <Button
          variant={filter === 'running' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('running')}
        >
          En cours ({historyItems.filter(item => item.status === 'running').length})
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{historyItems.length}</div>
            <p className="text-xs text-muted-foreground">
              +3 cette semaine
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Réussite</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <p className="text-xs text-muted-foreground">
              +5% cette semaine
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps Moyen</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18m</div>
            <p className="text-xs text-muted-foreground">
              -2m cette semaine
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exécutions Total</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">41</div>
            <p className="text-xs text-muted-foreground">
              +8 cette semaine
            </p>
          </CardContent>
        </Card>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(item.status)}
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Début</div>
                      <div className="font-medium">
                        {new Date(item.startedAt).toLocaleString('fr-FR')}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Durée</div>
                      <div className="font-medium">{item.duration}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Exécutions</div>
                      <div className="font-medium">{item.executions}</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-muted-foreground mb-1">Agents utilisés</div>
                    <div className="flex flex-wrap gap-1">
                      {item.agents.map((agent) => (
                        <Badge key={agent} variant="secondary" className="text-xs">
                          {agent}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-muted-foreground mb-1">Résultat</div>
                    <div className="text-sm">{item.output}</div>
                  </div>

                  {item.status === 'completed' && (
                    <div className="mb-4">
                      <div className="text-sm text-muted-foreground mb-1">Taux de réussite</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${item.successRate}%` }}
                        />
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {item.successRate}% de réussite
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
