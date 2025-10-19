'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Sparkles, 
  Zap, 
  Brain, 
  Image, 
  Video, 
  Music,
  Workflow,
  Settings,
  HelpCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/stores/ui-store'

const quickActions = [
  {
    id: 'new-workflow',
    label: 'Nouveau Workflow',
    icon: Plus,
    color: 'blue',
    action: () => console.log('Nouveau workflow'),
  },
  {
    id: 'ai-assistant',
    label: 'Assistant IA',
    icon: Sparkles,
    color: 'purple',
    action: () => console.log('Assistant IA'),
  },
  {
    id: 'quick-generate',
    label: 'Génération Rapide',
    icon: Zap,
    color: 'green',
    action: () => console.log('Génération rapide'),
  },
  {
    id: 'brain-storm',
    label: 'Brainstorming',
    icon: Brain,
    color: 'orange',
    action: () => console.log('Brainstorming'),
  },
]

export function QuickActions() {
  const [isOpen, setIsOpen] = useState(false)
  const { quickActionsOpen, setQuickActionsOpen } = useUIStore()

  const handleAction = (action: () => void) => {
    action()
    setIsOpen(false)
    setQuickActionsOpen(false)
  }

  return (
    <>
      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            size="lg"
            className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg"
            onClick={() => {
              setIsOpen(!isOpen)
              setQuickActionsOpen(!isOpen)
            }}
          >
            <motion.div
              animate={{ rotate: isOpen ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Plus className="h-6 w-6" />
            </motion.div>
          </Button>
        </motion.div>
      </motion.div>

      {/* Quick Actions Menu */}
      <AnimatePresence>
        {(isOpen || quickActionsOpen) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50"
          >
            <div className="space-y-2">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 backdrop-blur-xl shadow-lg hover:shadow-xl"
                    onClick={() => handleAction(action.action)}
                  >
                    <action.icon className="h-5 w-5" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {(isOpen || quickActionsOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
            onClick={() => {
              setIsOpen(false)
              setQuickActionsOpen(false)
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}
