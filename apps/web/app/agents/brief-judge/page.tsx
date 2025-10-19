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
  AlertTriangle,
  Scale
} from 'lucide-react'

export default function BriefJudgePage() {
  const [isRunning, setIsRunning] = useState(false)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            BriefJudge
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Agent IA spécialisé dans l'évaluation et la validation des briefs créatifs
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
            <Scale className="h-5 w-5" />
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
                  {isRunning ? 'Évaluation des briefs en cours...' : 'Prêt à évaluer de nouveaux briefs'}
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
                <Scale className="h-4 w-4 text-green-500" />
                <div>
                  <div className="font-medium">Brief Nike Q1 2025</div>
                  <div className="text-sm text-muted-foreground">Score: 8.5/10 - Validé il y a 5 minutes</div>
                </div>
              </div>
              <Badge variant="secondary">Validé</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Scale className="h-4 w-4 text-yellow-500" />
                <div>
                  <div className="font-medium">Brief Apple Product Launch</div>
                  <div className="text-sm text-muted-foreground">Score: 6.2/10 - Nécessite des améliorations</div>
                </div>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">À Améliorer</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <div>
                  <div className="font-medium">Brief Tesla Sustainability</div>
                  <div className="text-sm text-muted-foreground">Score: 4.1/10 - Rejeté</div>
                </div>
              </div>
              <Badge className="bg-red-100 text-red-800">Rejeté</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Briefs Évalués</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              +23 cette semaine
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Validation</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">
              +5% cette semaine
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score Moyen</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.2</div>
            <p className="text-xs text-muted-foreground">
              +0.3 cette semaine
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
