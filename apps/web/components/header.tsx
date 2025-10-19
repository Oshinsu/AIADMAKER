'use client'

import { Button } from '@/components/ui/button'
import { Play, Save, Download, Settings } from 'lucide-react'
import { useWorkflowStore } from '@/stores/workflow-store'

export function Header() {
  const { saveWorkflow, runWorkflow, exportWorkflow } = useWorkflowStore()

  return (
    <header className="border-b border-border bg-card px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">AI Ad Maker</h1>
          <span className="text-sm text-muted-foreground">
            Agence Marketing IA SOTA 2025
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={saveWorkflow}
          >
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={exportWorkflow}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          
          <Button
            size="sm"
            onClick={runWorkflow}
          >
            <Play className="h-4 w-4 mr-2" />
            Exécuter
          </Button>
          
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
