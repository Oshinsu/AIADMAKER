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
      className="flex h-full w-80 flex-col border-r border-slate-200/20 bg-gradient-to-b from-white/95 via-white/90 to-white/85 backdrop-blur-2xl shadow-2xl dark:border-slate-700/20 dark:bg-gradient-to-b dark:from-slate-900/95 dark:via-slate-900/90 dark:to-slate-900/85"
    >
      {/* Header */}
      <div className="relative flex items-center justify-between p-6 border-b border-slate-200/30 dark:border-slate-700/30">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur-sm"></div>
            <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              AI Ad Maker
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Navigation</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-200"
          onClick={() => setSidebarOpen(false)}
        >
          ×
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="px-6 pb-6">
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Actions Rapides
          </h3>
          {quickActions.map((action) => (
            <motion.div
              key={action.id}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/50 to-transparent dark:via-slate-800/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Button
                variant="ghost"
                className="relative w-full justify-start space-x-3 p-4 rounded-xl hover:bg-transparent transition-all duration-200"
              >
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl relative overflow-hidden",
                  action.color === 'blue' && "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25",
                  action.color === 'purple' && "bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25",
                  action.color === 'green' && "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25"
                )}>
                  <div className="absolute inset-0 bg-white/20 rounded-xl"></div>
                  <action.icon className="h-5 w-5 relative z-10" />
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{action.label}</span>
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
        whileHover={{ x: 6, scale: 1.02 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
        {item.children ? (
          <Button
            variant="ghost"
            className="relative w-full justify-between p-4 rounded-xl hover:bg-transparent transition-all duration-200"
            onClick={onToggle}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-xl blur-sm opacity-50"></div>
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 shadow-lg">
                  <item.icon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </div>
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
              {item.badge && (
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25">
                  {item.badge}
                </Badge>
              )}
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-slate-400 dark:text-slate-500"
            >
              <ChevronRight className="h-4 w-4" />
            </motion.div>
          </Button>
        ) : (
          <Link href={item.href}>
            <Button
              variant="ghost"
              className="relative w-full justify-start p-4 rounded-xl hover:bg-transparent transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-xl blur-sm opacity-50"></div>
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 shadow-lg">
                    <item.icon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  </div>
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
                {item.badge && (
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25">
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
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="ml-8 space-y-2 border-l-2 border-slate-200/30 dark:border-slate-700/30 pl-4 py-2">
              {item.children.map((child, index) => (
                <motion.div
                  key={child.id}
                  whileHover={{ x: 8, scale: 1.02 }}
                  initial={{ opacity: 0, x: -20, y: 10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  <Link href={child.href}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="relative w-full justify-start p-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-transparent transition-all duration-200"
                    >
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mr-3 opacity-60 group-hover:opacity-100 transition-opacity duration-200"></div>
                      <span className="text-sm font-medium">{child.label}</span>
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
