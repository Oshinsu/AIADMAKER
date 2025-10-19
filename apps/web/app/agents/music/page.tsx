'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Play, 
  Settings,
  History,
  Zap,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react'

export default function MusicPage() {
  const [isRunning, setIsRunning] = useState(false)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Music
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Agent IA spécialisé dans la création musicale et sonore
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configuration
          </Button>
          <Button onClick={() => setIsRunning(!isRunning)}>
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? 'Arrêter' : 'Démarrer'}
          </Button>
        </div>
      </div>

      {/* Agent Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Statut de l'Agent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isRunning ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <Clock className="h-6 w-6 text-yellow-500" />
              )}
              <div>
                <div className="font-medium">
                  {isRunning ? 'Agent Actif' : 'Agent en Veille'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {isRunning ? 'Traitement en cours...' : 'Prêt à traiter de nouvelles tâches'}
                </div>
              </div>
            </div>
            <Badge className={isRunning ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
              {isRunning ? 'Actif' : 'En Veille'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Activité Récente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-blue-500" />
                <div>
                  <div className="font-medium">Tâche Nike Q1 2025</div>
                  <div className="text-sm text-muted-foreground">Terminée il y a 2 minutes</div>
                </div>
              </div>
              <Badge variant="secondary">Terminé</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-green-500" />
                <div>
                  <div className="font-medium">Tâche Apple Product Launch</div>
                  <div className="text-sm text-muted-foreground">Terminée il y a 15 minutes</div>
                </div>
              </div>
              <Badge variant="secondary">Terminé</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <div>
                  <div className="font-medium">Tâche Tesla Sustainability</div>
                  <div className="text-sm text-muted-foreground">En cours de traitement...</div>
                </div>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">En Cours</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tâches Traitées</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              +12 cette semaine
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Réussite</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">
              +2% cette semaine
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps Moyen</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2m</div>
            <p className="text-xs text-muted-foreground">
              -0.4m cette semaine
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
