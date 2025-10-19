'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { Header } from './header'
import { Sidebar } from './sidebar'
import { CommandPalette } from './command-palette'
import { NotificationCenter } from './notification-center'
import { QuickActions } from './quick-actions'
import { useUIStore } from '@/stores/ui-store'

const layoutVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  }
}

const contentVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }
  }
}

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const { 
    sidebarOpen, 
    commandPaletteOpen, 
    notificationCenterOpen,
    setSidebarOpen,
    setCommandPaletteOpen,
    setNotificationCenterOpen
  } = useUIStore()

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Close mobile sidebar on route change
    if (window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }, [pathname, setSidebarOpen])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('/grid-pattern.svg')] bg-[size:60px_60px] opacity-5 dark:opacity-10" />
      
      {/* Main Layout */}
      <motion.div
        variants={layoutVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative flex h-screen overflow-hidden"
      >
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-80 lg:relative lg:z-auto"
            >
              <Sidebar />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <Header />
          
          {/* Content Area */}
          <motion.main
            variants={contentVariants}
            initial="initial"
            animate="animate"
            className="flex-1 overflow-auto p-6 lg:p-8"
          >
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </motion.main>
        </div>

        {/* Overlay for mobile */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Command Palette */}
      <AnimatePresence>
        {commandPaletteOpen && (
          <CommandPalette onClose={() => setCommandPaletteOpen(false)} />
        )}
      </AnimatePresence>

      {/* Notification Center */}
      <AnimatePresence>
        {notificationCenterOpen && (
          <NotificationCenter onClose={() => setNotificationCenterOpen(false)} />
        )}
      </AnimatePresence>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  )
}

function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mx-auto mb-8 h-16 w-16 rounded-full border-4 border-slate-200 border-t-blue-600"
        />
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-slate-900 dark:text-white"
        >
          AI Ad Maker
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-2 text-slate-600 dark:text-slate-400"
        >
          Chargement de votre espace créatif...
        </motion.p>
      </div>
    </motion.div>
  )
}
