'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Workflow, 
  Brain, 
  Image, 
  Video, 
  Music, 
  Mic, 
  CheckSquare, 
  Shield, 
  Settings,
  Plus,
  History,
  Star,
  TrendingUp,
  Users,
  BarChart3,
  Zap,
  Sparkles,
  ChevronRight,
  ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/ui-store'

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/',
    badge: null,
  },
  {
    id: 'workflows',
    label: 'Workflows',
    icon: Workflow,
    href: '/workflows',
    badge: '3',
    children: [
      { id: 'active', label: 'Actifs', href: '/workflows/active' },
      { id: 'templates', label: 'Modèles', href: '/workflows/templates' },
      { id: 'history', label: 'Historique', href: '/workflows/history' },
    ]
  },
  {
    id: 'agents',
    label: 'Agents IA',
    icon: Brain,
    href: '/agents',
    badge: '12',
    children: [
      { id: 'brief-gen', label: 'BriefGen', href: '/agents/brief-gen' },
      { id: 'brief-judge', label: 'BriefJudge', href: '/agents/brief-judge' },
      { id: 'prompt-smith', label: 'PromptSmith', href: '/agents/prompt-smith' },
      { id: 'image-artisan', label: 'ImageArtisan', href: '/agents/image-artisan' },
      { id: 'animator', label: 'Animator', href: '/agents/animator' },
      { id: 'editor', label: 'Editor', href: '/agents/editor' },
      { id: 'music', label: 'Music', href: '/agents/music' },
      { id: 'voice', label: 'Voice', href: '/agents/voice' },
      { id: 'spec-check', label: 'SpecCheck', href: '/agents/spec-check' },
      { id: 'compliance', label: 'Compliance', href: '/agents/compliance' },
      { id: 'orchestrator', label: 'Orchestrator', href: '/agents/orchestrator' },
    ]
  },
  {
    id: 'media',
    label: 'Média',
    icon: Image,
    href: '/media',
    badge: null,
    children: [
      { id: 'images', label: 'Images', href: '/media/images' },
      { id: 'videos', label: 'Vidéos', href: '/media/videos' },
      { id: 'audio', label: 'Audio', href: '/media/audio' },
      { id: 'templates', label: 'Modèles', href: '/media/templates' },
    ]
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    href: '/analytics',
    badge: null,
  },
  {
    id: 'brands',
    label: 'Marques',
    icon: Shield,
    href: '/brands',
    badge: '5',
  },
  {
    id: 'team',
    label: 'Équipe',
    icon: Users,
    href: '/team',
    badge: null,
  },
  {
    id: 'settings',
    label: 'Paramètres',
    icon: Settings,
    href: '/settings',
    badge: null,
  },
]

const quickActions = [
  { id: 'new-workflow', label: 'Nouveau Workflow', icon: Plus, color: 'blue' },
  { id: 'ai-assistant', label: 'Assistant IA', icon: Sparkles, color: 'purple' },
  { id: 'quick-generate', label: 'Génération Rapide', icon: Zap, color: 'green' },
]

export function Sidebar() {
  const [expandedItems, setExpandedItems] = useState<string[]>(['workflows', 'agents'])
  const { sidebarOpen, setSidebarOpen } = useUIStore()

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  return (
    <motion.aside
      initial={{ x: -320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -320, opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex h-full w-80 flex-col border-r border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/80"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Navigation
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          ×
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="px-6 pb-4">
        <div className="space-y-2">
          {quickActions.map((action) => (
            <motion.div
              key={action.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="ghost"
                className="w-full justify-start space-x-3 p-3"
              >
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg",
                  action.color === 'blue' && "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
                  action.color === 'purple' && "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
                  action.color === 'green' && "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                )}>
                  <action.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-6">
        {navigationItems.map((item) => (
          <NavigationItem
            key={item.id}
            item={item}
            isExpanded={expandedItems.includes(item.id)}
            onToggle={() => toggleExpanded(item.id)}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200/60 p-6 dark:border-slate-700/60">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Tous les services opérationnels
            </span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-500">
            Dernière mise à jour: il y a 2 min
          </div>
        </div>
      </div>
    </motion.aside>
  )
}

interface NavigationItemProps {
  item: typeof navigationItems[0]
  isExpanded: boolean
  onToggle: () => void
  key?: string
}

function NavigationItem({ item, isExpanded, onToggle }: NavigationItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="space-y-1">
      <motion.div
        whileHover={{ x: 4 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {item.children ? (
          <Button
            variant="ghost"
            className="w-full justify-between p-3"
            onClick={onToggle}
          >
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                <item.icon className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">{item.label}</span>
              {item.badge && (
                <Badge variant="secondary" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="h-4 w-4" />
            </motion.div>
          </Button>
        ) : (
          <Link href={item.href}>
            <Button
              variant="ghost"
              className="w-full justify-start p-3"
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                  <item.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </div>
            </Button>
          </Link>
        )}
      </motion.div>

      {/* Children */}
      <AnimatePresence>
        {item.children && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="ml-6 space-y-1">
              {item.children.map((child) => (
                <motion.div
                  key={child.id}
                  whileHover={{ x: 8 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href={child.href}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start p-2 text-slate-600 dark:text-slate-400"
                    >
                      <span className="text-xs">{child.label}</span>
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
