'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, Settings, User, Menu, Command, Sparkles, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUIStore } from '@/stores/ui-store'
import { useWorkflowStore } from '@/stores/workflow-store'

export function Header() {
  const [searchFocused, setSearchFocused] = useState(false)
  const { 
    sidebarOpen, 
    setSidebarOpen, 
    setCommandPaletteOpen, 
    setNotificationCenterOpen 
  } = useUIStore()
  const { nodes, edges } = useWorkflowStore()

  const hasWorkflow = nodes.length > 0

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/80"
    >
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 opacity-20"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Ad Maker
            </span>
          </motion.div>

          {/* Workflow Status */}
          <AnimatePresence>
            {hasWorkflow && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Workflow actif
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-4">
          <motion.div
            className="relative"
            animate={{ scale: searchFocused ? 1.02 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher des agents, workflows..."
              className="w-full rounded-lg border border-slate-200 bg-white/50 py-2 pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:focus:border-blue-400 dark:focus:bg-slate-800"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              onKeyDown={(e) => {
                if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault()
                  setCommandPaletteOpen(true)
                }
              }}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <kbd className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                ⌘K
              </kbd>
            </div>
          </motion.div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* Quick Actions */}
          <div className="hidden sm:flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setCommandPaletteOpen(true)}
            >
              <Command className="h-4 w-4" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-blue-500"
              />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setNotificationCenterOpen(true)}
            >
              <Bell className="h-4 w-4" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"
              />
            </Button>

            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          {/* User Menu */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3 rounded-lg border border-slate-200 bg-white/50 p-1 dark:border-slate-700 dark:bg-slate-800/50"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/user.jpg" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                John Doe
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Creative Director
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Progress Bar */}
      <AnimatePresence>
        {hasWorkflow && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 3, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="absolute bottom-0 left-0 right-0"
          >
            <motion.div
              animate={{ width: "100%" }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
