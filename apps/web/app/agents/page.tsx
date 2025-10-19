'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
  Square,
  Activity,
  Shield
} from 'lucide-react'
import { useAgentStore } from '@/stores/agent-store'

export default function AgentsPage() {
  const { agents, updateAgentStatus } = useAgentStore()

  const agentIcons = {
    'brief-gen': Brain,
    'brief-judge': CheckCircle,
    'prompt-smith': Megaphone,
    'image-artisan': Image,
    'animator': Video,
    'editor': Video,
    'music-gen': Music,
    'voice-gen': Mic,
    'spec-check': CheckCircle,
    'compliance': Shield
  }

  const agentStatus = {
    active: { color: 'bg-green-500', text: 'Actif' },
    idle: { color: 'bg-gray-500', text: 'Inactif' },
    error: { color: 'bg-red-500', text: 'Erreur' },
    maintenance: { color: 'bg-yellow-500', text: 'Maintenance' }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agents IA</h1>
          <p className="text-muted-foreground">
            Gérez et surveillez vos agents d'intelligence artificielle
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configuration
          </Button>
          <Button>
            <Bot className="h-4 w-4 mr-2" />
            Nouvel Agent
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents.length}</div>
            <p className="text-xs text-muted-foreground">
              Agents configurés
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actifs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {agents.filter(a => a.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              En fonctionnement
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tâches/jour</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              +12% vs hier
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de succès</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">
              Performance excellente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => {
          const Icon = agentIcons[agent.id as keyof typeof agentIcons] || Bot
          const statusInfo = agentStatus[agent.status as keyof typeof agentStatus]
          
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 rounded-full bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                        <CardDescription>{agent.description}</CardDescription>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${statusInfo.color}`} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={statusInfo.color}>
                      {statusInfo.text}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {agent.lastActivity}
                    </span>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Tâches</span>
                      <div className="font-semibold">{agent.tasksCompleted}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Temps moyen</span>
                      <div className="font-semibold">{agent.averageTime}ms</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Erreurs</span>
                      <div className="font-semibold text-red-600">{agent.errors}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Uptime</span>
                      <div className="font-semibold">{agent.uptime}%</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 pt-4 border-t">
                    {agent.status === 'active' ? (
                      <Button variant="outline" size="sm" onClick={() => updateAgentStatus(agent.id, 'idle')}>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => updateAgentStatus(agent.id, 'active')}>
                        <Play className="h-4 w-4 mr-2" />
                        Démarrer
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Config
                    </Button>
                    <Button variant="outline" size="sm">
                      <Square className="h-4 w-4 mr-2" />
                      Arrêter
                    </Button>
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
