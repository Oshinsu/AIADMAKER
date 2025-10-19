'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Plus, 
  Download,
  Edit,
  Trash2,
  Eye,
  Copy,
  Star,
  Clock
} from 'lucide-react'

const templates = [
  {
    id: '1',
    name: 'Campagne Publicitaire Standard',
    description: 'Template pour campagnes publicitaires classiques',
    category: 'Advertising',
    difficulty: 'Facile',
    estimatedTime: '15 min',
    uses: 47,
    rating: 4.8,
    tags: ['publicité', 'standard', 'facile'],
    createdAt: '2025-01-10T10:30:00Z',
    author: 'Alice Martin'
  },
  {
    id: '2',
    name: 'Lancement Produit Tech',
    description: 'Template spécialisé pour les lancements de produits technologiques',
    category: 'Product Launch',
    difficulty: 'Moyen',
    estimatedTime: '30 min',
    uses: 23,
    rating: 4.6,
    tags: ['tech', 'lancement', 'produit'],
    createdAt: '2025-01-08T14:20:00Z',
    author: 'Bob Chen'
  },
  {
    id: '3',
    name: 'Campagne Écologique',
    description: 'Template pour campagnes axées sur la durabilité',
    category: 'Sustainability',
    difficulty: 'Avancé',
    estimatedTime: '45 min',
    uses: 12,
    rating: 4.9,
    tags: ['écologie', 'durabilité', 'vert'],
    createdAt: '2025-01-05T09:15:00Z',
    author: 'Claire Dubois'
  }
]

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Facile':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Moyen':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'Avancé':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Modèles de Workflows
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Découvrez et utilisez nos templates prêts à l'emploi
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Créer un Template
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Templates Disponibles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +3 cette semaine
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisations Total</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">
              +28 cette semaine
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Note Moyenne</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7</div>
            <p className="text-xs text-muted-foreground">
              +0.2 ce mois-ci
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps Moyen</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28m</div>
            <p className="text-xs text-muted-foreground">
              -5m cette semaine
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {template.description}
                  </CardDescription>
                </div>
                <Badge className={getDifficultyColor(template.difficulty)}>
                  {template.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold">{template.uses}</div>
                  <div className="text-xs text-muted-foreground">Utilisations</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{template.rating}</div>
                  <div className="text-xs text-muted-foreground">Note</div>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Temps estimé: {template.estimatedTime}
                </div>
                <div className="text-sm text-muted-foreground">
                  Par {template.author}
                </div>
              </div>

              {/* Tags */}
              <div>
                <div className="flex flex-wrap gap-1">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  Prévisualiser
                </Button>
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
