'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, 
  X, 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  Info,
  Clock,
  Filter,
  MarkAsRead
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useUIStore } from '@/stores/ui-store'

interface NotificationCenterProps {
  onClose: () => void
}

export function NotificationCenter({ onClose }: NotificationCenterProps) {
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all')
  const { notifications, markNotificationAsRead, clearAllNotifications } = useUIStore()

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read
    if (filter === 'important') return notification.type === 'error' || notification.type === 'warning'
    return true
  })

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-end pt-20 pr-4"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Notification Center */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, x: 20 }}
        animate={{ scale: 1, opacity: 1, x: 0 }}
        exit={{ scale: 0.95, opacity: 0, x: 20 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md rounded-2xl border border-slate-200/60 bg-white/95 backdrop-blur-xl shadow-2xl dark:border-slate-700/60 dark:bg-slate-900/95"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/60 p-4 dark:border-slate-700/60">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span className="font-semibold">Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                notifications.forEach(n => markNotificationAsRead(n.id))
              }}
            >
              <MarkAsRead className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearNotifications}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-1 border-b border-slate-200/60 p-2 dark:border-slate-700/60">
          <Button
            variant={filter === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
            className="text-xs"
          >
            Toutes
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('unread')}
            className="text-xs"
          >
            Non lues
          </Button>
          <Button
            variant={filter === 'important' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('important')}
            className="text-xs"
          >
            Importantes
          </Button>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto p-2">
          <AnimatePresence>
            {filteredNotifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <Bell className="h-12 w-12 text-slate-400" />
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Aucune notification
                </p>
              </motion.div>
            ) : (
              filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="flex items-start space-x-3 rounded-lg p-3 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full",
                    notification.type === 'success' && "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
                    notification.type === 'error' && "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400",
                    notification.type === 'warning' && "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
                    notification.type === 'info' && "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                  )}>
                    {notification.type === 'success' && <CheckCircle className="h-4 w-4" />}
                    {notification.type === 'error' && <AlertCircle className="h-4 w-4" />}
                    {notification.type === 'warning' && <AlertTriangle className="h-4 w-4" />}
                    {notification.type === 'info' && <Info className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className={cn(
                        "font-medium",
                        notification.read ? "text-slate-600 dark:text-slate-400" : "text-slate-900 dark:text-white"
                      )}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {notification.message}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <span className="text-xs text-slate-400">
                        {notification.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markNotificationAsRead(notification.id)}
                      className="h-6 w-6 p-0"
                    >
                      <CheckCircle className="h-3 w-3" />
                    </Button>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}
