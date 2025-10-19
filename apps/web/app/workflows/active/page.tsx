'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Play, 
  Pause, 
  Square, 
  Settings,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertTriangle,
  Zap
} from 'lucide-react'

const activeWorkflows = [
  {
    id: '1',
    name: 'Campagne Nike Q1',
    description: 'Génération automatique de contenu publicitaire pour Nike',
    status: 'running',
    progress: 75,
    lastRun: '2025-01-15T14:30:00Z',
    nextRun: '2025-01-15T16:00:00Z',
    executions: 12,
    successRate: 95,
    agents: ['BriefGen', 'ImageArtisan', 'Editor']
  },
  {
    id: '2',
    name: 'Apple Product Launch',
    description: 'Création de contenu pour le lancement du nouvel iPhone',
    status: 'paused',
    progress: 45,
    lastRun: '2025-01-14T10:15:00Z',
    nextRun: null,
    executions: 8,
    successRate: 88,
    agents: ['PromptSmith', 'Animator', 'Compliance']
  },
  {
    id: '3',
    name: 'Tesla Sustainability',
    description: 'Contenu sur la durabilité et l\'énergie verte',
    status: 'running',
    progress: 90,
    lastRun: '2025-01-15T12:45:00Z',
    nextRun: '2025-01-15T18:00:00Z',
    executions: 15,
    successRate: 92,
    agents: ['BriefJudge', 'Music', 'Voice']
  }
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'running':
      return <Play className="h-4 w-4 text-green-500" />
    case 'paused':
      return <Pause className="h-4 w-4 text-yellow-500" />
    case 'stopped':
      return <Square className="h-4 w-4 text-red-500" />
    default:
      return <Clock className="h-4 w-4 text-gray-500" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'running':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'paused':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'stopped':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

export default function ActiveWorkflowsPage() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Workflows Actifs
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Surveillez et gérez vos workflows en cours d'exécution
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configuration
          </Button>
          <Button>
            <Zap className="h-4 w-4 mr-2" />
            Nouveau Workflow
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workflows Actifs</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              +1 cette semaine
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exécutions Aujourd'hui</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">35</div>
            <p className="text-xs text-muted-foreground">
              +12% depuis hier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Réussite</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              +3% cette semaine
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps Moyen</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2m</div>
            <p className="text-xs text-muted-foreground">
              -0.5m cette semaine
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Workflows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeWorkflows.map((workflow) => (
          <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{workflow.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {workflow.description}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(workflow.status)}
                  <Badge className={getStatusColor(workflow.status)}>
                    {workflow.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progression</span>
                  <span>{workflow.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${workflow.progress}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold">{workflow.executions}</div>
                  <div className="text-xs text-muted-foreground">Exécutions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{workflow.successRate}%</div>
                  <div className="text-xs text-muted-foreground">Réussite</div>
                </div>
              </div>

              {/* Agents */}
              <div>
                <h4 className="text-sm font-medium mb-2">Agents Utilisés</h4>
                <div className="flex flex-wrap gap-1">
                  {workflow.agents.map((agent) => (
                    <Badge key={agent} variant="secondary" className="text-xs">
                      {agent}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Schedule */}
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Dernière exécution: {new Date(workflow.lastRun).toLocaleString('fr-FR')}
                </div>
                {workflow.nextRun && (
                  <div className="flex items-center gap-2 mt-1">
                    <Zap className="h-4 w-4" />
                    Prochaine: {new Date(workflow.nextRun).toLocaleString('fr-FR')}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  Voir
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Pause className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
