'use client'

import { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Users, 
  Image, 
  Video, 
  Music, 
  Mic, 
  CheckCircle, 
  Shield,
  Settings,
  Play,
  X
} from 'lucide-react'

const agentConfig = {
  'brief-gen': {
    label: 'Brief Generator',
    icon: FileText,
    color: 'bg-blue-500',
    description: 'Génère des briefs créatifs complets'
  },
  'brief-judge': {
    label: 'Brief Judge',
    icon: Users,
    color: 'bg-blue-600',
    description: 'Compare et évalue les briefs'
  },
  'prompt-smith': {
    label: 'Prompt Smith',
    icon: Settings,
    color: 'bg-purple-500',
    description: 'Optimise les prompts pour génération'
  },
  'image-artisan': {
    label: 'Image Artisan',
    icon: Image,
    color: 'bg-green-500',
    description: 'Génère images de référence et variantes'
  },
  'animator': {
    label: 'Animator',
    icon: Video,
    color: 'bg-orange-500',
    description: 'Anime les images en vidéos'
  },
  'editor': {
    label: 'Editor',
    icon: Play,
    color: 'bg-orange-600',
    description: 'Monte et finalise les vidéos'
  },
  'music-gen': {
    label: 'Music Generator',
    icon: Music,
    color: 'bg-pink-500',
    description: 'Génère musique et bandes sonores'
  },
  'voice-gen': {
    label: 'Voice Generator',
    icon: Mic,
    color: 'bg-pink-600',
    description: 'Synthèse vocale multilingue'
  },
  'spec-check': {
    label: 'Spec Check',
    icon: CheckCircle,
    color: 'bg-yellow-500',
    description: 'Valide les spécifications par plateforme'
  },
  'compliance': {
    label: 'Compliance',
    icon: Shield,
    color: 'bg-red-500',
    description: 'Vérifie conformité et droits'
  }
}

export const AgentNode = memo(({ data, selected, id }: NodeProps) => {
  const config = agentConfig[data.agentType as keyof typeof agentConfig]
  const Icon = config?.icon || Settings

  return (
    <Card className={`min-w-[200px] ${selected ? 'ring-2 ring-primary' : ''}`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-primary"
      />
      
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className={`p-1.5 rounded ${config?.color} text-white`}>
              <Icon className="h-3 w-3" />
            </div>
            <span className="font-medium text-sm">{config?.label}</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => {
              // Remove node logic
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mb-2">
          {config?.description}
        </p>
        
        <div className="flex items-center justify-between">
          <Badge 
            variant={data.status === 'completed' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {data.status || 'pending'}
          </Badge>
          
          {data.progress && (
            <div className="text-xs text-muted-foreground">
              {data.progress}%
            </div>
          )}
        </div>
      </CardContent>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-primary"
      />
    </Card>
  )
})

AgentNode.displayName = 'AgentNode'
