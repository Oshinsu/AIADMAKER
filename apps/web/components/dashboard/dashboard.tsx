'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, 
  Users, 
  Zap, 
  Brain, 
  Image, 
  Video, 
  Music,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  BarChart3,
  Activity,
  Target,
  Award
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useUIStore } from '@/stores/ui-store'
import { useWorkflowStore } from '@/stores/workflow-store'
import { cn } from '@/lib/utils'

const stats = [
  {
    id: 'workflows',
    title: 'Workflows Actifs',
    value: '12',
    change: '+3',
    changeType: 'positive' as const,
    icon: TrendingUp,
    color: 'blue',
  },
  {
    id: 'agents',
    title: 'Agents IA',
    value: '8',
    change: '+2',
    changeType: 'positive' as const,
    icon: Brain,
    color: 'purple',
  },
  {
    id: 'generations',
    title: 'Générations',
    value: '1,247',
    change: '+156',
    changeType: 'positive' as const,
    icon: Zap,
    color: 'green',
  },
  {
    id: 'success-rate',
    title: 'Taux de Succès',
    value: '94.2%',
    change: '+2.1%',
    changeType: 'positive' as const,
    icon: Target,
    color: 'emerald',
  },
]

const recentActivity = [
  {
    id: '1',
    type: 'workflow',
    title: 'Nouveau workflow créé',
    description: 'Campagne Nike Air Max 270',
    timestamp: 'Il y a 2 min',
    status: 'success',
    icon: CheckCircle,
  },
  {
    id: '2',
    type: 'generation',
    title: 'Génération terminée',
    description: '3 images générées pour Facebook',
    timestamp: 'Il y a 5 min',
    status: 'success',
    icon: Image,
  },
  {
    id: '3',
    type: 'agent',
    title: 'Agent BriefGen actif',
    description: 'Analyse des briefs en cours',
    timestamp: 'Il y a 8 min',
    status: 'running',
    icon: Brain,
  },
  {
    id: '4',
    type: 'approval',
    title: 'Approbation requise',
    description: 'Asset en attente de validation',
    timestamp: 'Il y a 12 min',
    status: 'pending',
    icon: AlertCircle,
  },
]

const agentStatus = [
  {
    id: 'brief-gen',
    name: 'BriefGen',
    status: 'active',
    efficiency: 95,
    lastUsed: '2 min',
    color: 'blue',
  },
  {
    id: 'brief-judge',
    name: 'BriefJudge',
    status: 'active',
    efficiency: 92,
    lastUsed: '5 min',
    color: 'purple',
  },
  {
    id: 'image-artisan',
    name: 'ImageArtisan',
    status: 'active',
    efficiency: 88,
    lastUsed: '1 min',
    color: 'green',
  },
  {
    id: 'animator',
    name: 'Animator',
    status: 'idle',
    efficiency: 0,
    lastUsed: '1h',
    color: 'orange',
  },
  {
    id: 'editor',
    name: 'Editor',
    status: 'maintenance',
    efficiency: 0,
    lastUsed: '2h',
    color: 'red',
  },
]

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const { addNotification } = useUIStore()
  const { nodes, edges } = useWorkflowStore()

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        addNotification({
          type: 'info',
          title: 'Mise à jour en temps réel',
          message: 'Nouvelle génération terminée',
        })
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [addNotification])

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Vue d'ensemble de votre espace créatif IA
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <BarChart3 className="mr-2 h-4 w-4" />
            Rapports
          </Button>
          <Button size="sm">
            <Sparkles className="mr-2 h-4 w-4" />
            Nouveau Workflow
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <StatCard stat={stat} />
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Activité Récente</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full",
                      activity.status === 'success' && "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
                      activity.status === 'running' && "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
                      activity.status === 'pending' && "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
                    )}>
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {activity.title}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {activity.description}
                      </p>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-500">
                      {activity.timestamp}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Agent Status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>Statut des Agents</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agentStatus.map((agent, index) => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "h-2 w-2 rounded-full",
                        agent.status === 'active' && "bg-green-500",
                        agent.status === 'idle' && "bg-yellow-500",
                        agent.status === 'maintenance' && "bg-red-500"
                      )} />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {agent.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                          {agent.lastUsed}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {agent.efficiency}%
                      </div>
                      <div className="w-16">
                        <Progress value={agent.efficiency} className="h-1" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Actions Rapides</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <QuickActionCard
                title="Nouveau Workflow"
                description="Créer un workflow personnalisé"
                icon={TrendingUp}
                color="blue"
                onClick={() => console.log('Nouveau workflow')}
              />
              <QuickActionCard
                title="Génération Rapide"
                description="Générer du contenu rapidement"
                icon={Zap}
                color="green"
                onClick={() => console.log('Génération rapide')}
              />
              <QuickActionCard
                title="Assistant IA"
                description="Obtenir de l'aide créative"
                icon={Brain}
                color="purple"
                onClick={() => console.log('Assistant IA')}
              />
              <QuickActionCard
                title="Analytics"
                description="Voir les performances"
                icon={BarChart3}
                color="orange"
                onClick={() => console.log('Analytics')}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

function StatCard({ stat }: { stat: typeof stats[0] }) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {stat.title}
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {stat.value}
            </p>
            <div className="flex items-center space-x-1">
              <Badge
                variant={stat.changeType === 'positive' ? 'default' : 'destructive'}
                className="text-xs"
              >
                {stat.change}
              </Badge>
              <span className="text-xs text-slate-500 dark:text-slate-500">
                vs hier
              </span>
            </div>
          </div>
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-lg",
            stat.color === 'blue' && "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
            stat.color === 'purple' && "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
            stat.color === 'green' && "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
            stat.color === 'emerald' && "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
          )}>
            <stat.icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function QuickActionCard({ 
  title, 
  description, 
  icon: Icon, 
  color, 
  onClick 
}: {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  onClick: () => void
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        variant="outline"
        className="h-auto flex-col items-start space-y-2 p-4"
        onClick={onClick}
      >
        <div className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg",
          color === 'blue' && "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
          color === 'green' && "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
          color === 'purple' && "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
          color === 'orange' && "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
        )}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="text-left">
          <p className="font-medium">{title}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
      </Button>
    </motion.div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-8 w-64 bg-slate-200 rounded dark:bg-slate-700" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 bg-slate-200 rounded-lg dark:bg-slate-700" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 h-64 bg-slate-200 rounded-lg dark:bg-slate-700" />
        <div className="h-64 bg-slate-200 rounded-lg dark:bg-slate-700" />
      </div>
    </div>
  )
}
