'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Workflow, 
  Users, 
  Image, 
  BarChart3, 
  Settings,
  Zap,
  Shield,
  Activity
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigationItems = [
  {
    href: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Vue d\'ensemble du système'
  },
  {
    href: '/workflows',
    label: 'Workflows',
    icon: Workflow,
    description: 'Gestion des workflows'
  },
  {
    href: '/agents',
    label: 'Agents',
    icon: Users,
    description: 'Monitoring des agents IA'
  },
  {
    href: '/media',
    label: 'Médias',
    icon: Image,
    description: 'Gestion des assets créatifs'
  },
  {
    href: '/analytics',
    label: 'Analytics',
    icon: BarChart3,
    description: 'Analyses et métriques'
  },
  {
    href: '/apis',
    label: 'APIs',
    icon: Zap,
    description: 'Connecteurs et APIs'
  },
  {
    href: '/settings',
    label: 'Paramètres',
    icon: Settings,
    description: 'Configuration système'
  }
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col space-y-1 p-4">
      {navigationItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        
        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start h-auto p-3",
                isActive && "bg-primary text-primary-foreground"
              )}
            >
              <Icon className="h-4 w-4 mr-3" />
              <div className="flex flex-col items-start">
                <span className="font-medium">{item.label}</span>
                <span className="text-xs opacity-70">{item.description}</span>
              </div>
            </Button>
          </Link>
        )
      })}
    </nav>
  )
}
