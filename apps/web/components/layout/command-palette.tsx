'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Command, 
  ArrowRight, 
  Sparkles, 
  Workflow, 
  Brain, 
  Image, 
  Video, 
  Music, 
  Settings,
  Zap,
  TrendingUp,
  Users,
  BarChart3,
  Shield,
  History,
  Star,
  Plus,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface CommandPaletteProps {
  onClose: () => void
}

const commands = [
  {
    id: 'new-workflow',
    title: 'Nouveau Workflow',
    description: 'Créer un nouveau workflow de génération',
    icon: Plus,
    category: 'Workflow',
    keywords: ['nouveau', 'créer', 'workflow', 'génération'],
    action: () => console.log('Nouveau workflow'),
  },
  {
    id: 'ai-assistant',
    title: 'Assistant IA',
    description: 'Ouvrir l\'assistant IA pour l\'aide créative',
    icon: Sparkles,
    category: 'IA',
    keywords: ['assistant', 'ia', 'aide', 'créatif'],
    action: () => console.log('Assistant IA'),
  },
  {
    id: 'quick-generate',
    title: 'Génération Rapide',
    description: 'Générer du contenu rapidement',
    icon: Zap,
    category: 'Génération',
    keywords: ['rapide', 'générer', 'contenu', 'quick'],
    action: () => console.log('Génération rapide'),
  },
  {
    id: 'workflows',
    title: 'Gérer les Workflows',
    description: 'Voir et gérer tous les workflows',
    icon: Workflow,
    category: 'Workflow',
    keywords: ['workflows', 'gérer', 'voir'],
    action: () => console.log('Workflows'),
  },
  {
    id: 'agents',
    title: 'Agents IA',
    description: 'Configurer et gérer les agents IA',
    icon: Brain,
    category: 'IA',
    keywords: ['agents', 'ia', 'configurer'],
    action: () => console.log('Agents'),
  },
  {
    id: 'media-library',
    title: 'Bibliothèque Média',
    description: 'Accéder à la bibliothèque de médias',
    icon: Image,
    category: 'Média',
    keywords: ['média', 'bibliothèque', 'images', 'vidéos'],
    action: () => console.log('Média'),
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'Voir les analyses et métriques',
    icon: BarChart3,
    category: 'Analytics',
    keywords: ['analytics', 'métriques', 'analyses'],
    action: () => console.log('Analytics'),
  },
  {
    id: 'brands',
    title: 'Gestion des Marques',
    description: 'Gérer les guidelines de marque',
    icon: Shield,
    category: 'Marque',
    keywords: ['marque', 'guidelines', 'gérer'],
    action: () => console.log('Marques'),
  },
  {
    id: 'team',
    title: 'Équipe',
    description: 'Gérer les membres de l\'équipe',
    icon: Users,
    category: 'Équipe',
    keywords: ['équipe', 'membres', 'collaborateurs'],
    action: () => console.log('Équipe'),
  },
  {
    id: 'settings',
    title: 'Paramètres',
    description: 'Configurer l\'application',
    icon: Settings,
    category: 'Configuration',
    keywords: ['paramètres', 'config', 'settings'],
    action: () => console.log('Paramètres'),
  },
]

const categories = [
  { id: 'Workflow', label: 'Workflow', icon: Workflow },
  { id: 'IA', label: 'IA', icon: Brain },
  { id: 'Génération', label: 'Génération', icon: Zap },
  { id: 'Média', label: 'Média', icon: Image },
  { id: 'Analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'Marque', label: 'Marque', icon: Shield },
  { id: 'Équipe', label: 'Équipe', icon: Users },
  { id: 'Configuration', label: 'Configuration', icon: Settings },
]

export function CommandPalette({ onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const filteredCommands = commands.filter(command => {
    const matchesQuery = query === '' || 
      command.title.toLowerCase().includes(query.toLowerCase()) ||
      command.description.toLowerCase().includes(query.toLowerCase()) ||
      command.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()))
    
    const matchesCategory = !selectedCategory || command.category === selectedCategory
    
    return matchesQuery && matchesCategory
  })

  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = []
    }
    acc[command.category].push(command)
    return acc
  }, {} as Record<string, typeof commands>)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action()
          onClose()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex, filteredCommands, onClose])

  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Command Palette */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-2xl rounded-2xl border border-slate-200/60 bg-white/95 backdrop-blur-xl shadow-2xl dark:border-slate-700/60 dark:bg-slate-900/95"
      >
        {/* Header */}
        <div className="flex items-center border-b border-slate-200/60 p-4 dark:border-slate-700/60">
          <Search className="mr-3 h-5 w-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Rechercher des commandes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-lg placeholder:text-slate-400 focus:outline-none"
          />
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <kbd className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 dark:border-slate-700 dark:bg-slate-800">
              ⌘K
            </kbd>
            <span>pour ouvrir</span>
          </div>
        </div>

        {/* Categories */}
        <div className="flex space-x-1 border-b border-slate-200/60 p-2 dark:border-slate-700/60">
          <Button
            variant={selectedCategory === null ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="text-xs"
          >
            Tous
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="text-xs"
            >
              <category.icon className="mr-1 h-3 w-3" />
              {category.label}
            </Button>
          ))}
        </div>

        {/* Commands List */}
        <div className="max-h-96 overflow-y-auto p-2" ref={listRef}>
          {Object.entries(groupedCommands).map(([category, categoryCommands]) => (
            <div key={category} className="mb-4">
              <div className="mb-2 px-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                {category}
              </div>
              <div className="space-y-1">
                {categoryCommands.map((command, index) => {
                  const globalIndex = filteredCommands.findIndex(c => c.id === command.id)
                  const isSelected = globalIndex === selectedIndex
                  
                  return (
                    <motion.div
                      key={command.id}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button
                        onClick={() => {
                          command.action()
                          onClose()
                        }}
                        className={cn(
                          "flex w-full items-center space-x-3 rounded-lg p-3 text-left transition-colors",
                          isSelected
                            ? "bg-blue-100 text-blue-900 dark:bg-blue-900/20 dark:text-blue-100"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800"
                        )}
                      >
                        <div className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg",
                          isSelected
                            ? "bg-blue-200 text-blue-700 dark:bg-blue-800 dark:text-blue-200"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        )}>
                          <command.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{command.title}</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {command.description}
                          </div>
                        </div>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white"
                          >
                            <ArrowRight className="h-3 w-3" />
                          </motion.div>
                        )}
                      </button>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200/60 p-4 dark:border-slate-700/60">
          <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <kbd className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 dark:border-slate-700 dark:bg-slate-800">
                  ↑↓
                </kbd>
                <span>naviguer</span>
              </div>
              <div className="flex items-center space-x-1">
                <kbd className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 dark:border-slate-700 dark:bg-slate-800">
                  ↵
                </kbd>
                <span>sélectionner</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <kbd className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 dark:border-slate-700 dark:bg-slate-800">
                esc
              </kbd>
              <span>fermer</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
