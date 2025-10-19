'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Play, 
  Pause, 
  Square, 
  Settings, 
  Plus, 
  Filter,
  Search,
  MoreHorizontal,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react'
import { useWorkflowStore } from '@/stores/workflow-store'

export default function WorkflowsPage() {
  const { workflows, createWorkflow, updateWorkflow, deleteWorkflow } = useWorkflowStore()

  const workflowStatus = {
    running: { icon: Play, color: 'bg-blue-500', text: 'En cours' },
    paused: { icon: Pause, color: 'bg-yellow-500', text: 'En pause' },
    completed: { icon: CheckCircle, color: 'bg-green-500', text: 'Terminé' },
    failed: { icon: XCircle, color: 'bg-red-500', text: 'Échec' },
    pending: { icon: Clock, color: 'bg-gray-500', text: 'En attente' }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Workflows</h1>
          <p className="text-muted-foreground">
            Gérez vos workflows d'IA pour la création de publicités
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Rechercher
          </Button>
          <Button onClick={() => createWorkflow({
            name: 'Nouveau Workflow',
            description: 'Description du workflow',
            status: 'pending',
            progress: 0,
            steps: [],
            createdBy: 'user',
            tags: [],
            metadata: {}
          })}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Workflow
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflows.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 depuis hier
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workflows.filter(w => w.status === 'running').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Workflows actifs
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terminés</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workflows.filter(w => w.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Cette semaine
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de succès</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">
              +5% vs mois dernier
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Workflows List */}
      <div className="space-y-4">
        {workflows.map((workflow) => {
          const StatusIcon = workflowStatus[workflow.status as keyof typeof workflowStatus].icon
          const statusColor = workflowStatus[workflow.status as keyof typeof workflowStatus].color
          const statusText = workflowStatus[workflow.status as keyof typeof workflowStatus].text

          return (
            <motion.div
              key={workflow.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${statusColor}`}>
                        <StatusIcon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{workflow.name}</CardTitle>
                        <CardDescription>
                          {workflow.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{statusText}</Badge>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progression</span>
                        <span>{workflow.progress}%</span>
                      </div>
                      <Progress value={workflow.progress} className="h-2" />
                    </div>

                    {/* Steps */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {workflow.steps.map((step, index) => (
                        <div
                          key={index}
                          className={`p-2 rounded text-xs text-center ${
                            step.completed 
                              ? 'bg-green-100 text-green-800' 
                              : step.active 
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {step.name}
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Créé il y a {workflow.createdAt}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {workflow.status === 'running' ? (
                          <Button variant="outline" size="sm">
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </Button>
                        ) : workflow.status === 'paused' ? (
                          <Button variant="outline" size="sm">
                            <Play className="h-4 w-4 mr-2" />
                            Reprendre
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm">
                            <Play className="h-4 w-4 mr-2" />
                            Démarrer
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Configurer
                        </Button>
                        <Button variant="outline" size="sm">
                          <Square className="h-4 w-4 mr-2" />
                          Arrêter
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
