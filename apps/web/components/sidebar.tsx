'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  Play
} from 'lucide-react'
import { useWorkflowStore } from '@/stores/workflow-store'

const agentNodes = [
  {
    id: 'brief-gen',
    label: 'Brief Generator',
    description: 'Génère des briefs créatifs complets',
    icon: FileText,
    category: 'Strategy',
    color: 'bg-blue-500'
  },
  {
    id: 'brief-judge',
    label: 'Brief Judge',
    description: 'Compare et évalue les briefs',
    icon: Users,
    category: 'Strategy',
    color: 'bg-blue-600'
  },
  {
    id: 'prompt-smith',
    label: 'Prompt Smith',
    description: 'Optimise les prompts pour génération',
    icon: Settings,
    category: 'Creation',
    color: 'bg-purple-500'
  },
  {
    id: 'image-artisan',
    label: 'Image Artisan',
    description: 'Génère images de référence et variantes',
    icon: Image,
    category: 'Visual',
    color: 'bg-green-500'
  },
  {
    id: 'animator',
    label: 'Animator',
    description: 'Anime les images en vidéos',
    icon: Video,
    category: 'Video',
    color: 'bg-orange-500'
  },
  {
    id: 'editor',
    label: 'Editor',
    description: 'Monte et finalise les vidéos',
    icon: Play,
    category: 'Video',
    color: 'bg-orange-600'
  },
  {
    id: 'music-gen',
    label: 'Music Generator',
    description: 'Génère musique et bandes sonores',
    icon: Music,
    category: 'Audio',
    color: 'bg-pink-500'
  },
  {
    id: 'voice-gen',
    label: 'Voice Generator',
    description: 'Synthèse vocale multilingue',
    icon: Mic,
    category: 'Audio',
    color: 'bg-pink-600'
  },
  {
    id: 'spec-check',
    label: 'Spec Check',
    description: 'Valide les spécifications par plateforme',
    icon: CheckCircle,
    category: 'Quality',
    color: 'bg-yellow-500'
  },
  {
    id: 'compliance',
    label: 'Compliance',
    description: 'Vérifie conformité et droits',
    icon: Shield,
    category: 'Quality',
    color: 'bg-red-500'
  }
]

const categories = ['Strategy', 'Creation', 'Visual', 'Video', 'Audio', 'Quality']

export function Sidebar() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredNodes = selectedCategory 
    ? agentNodes.filter(node => node.category === selectedCategory)
    : agentNodes

  return (
    <aside className="w-80 border-r border-border bg-card">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Agents IA</h2>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            Tous
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Agent Nodes */}
        <div className="space-y-2">
          {filteredNodes.map(node => {
            const Icon = node.icon
            return (
              <Card 
                key={node.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => console.log('Node clicked:', node.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${node.color} text-white`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm">{node.label}</h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {node.description}
                      </p>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {node.category}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
