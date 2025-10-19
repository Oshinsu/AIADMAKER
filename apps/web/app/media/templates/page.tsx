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
  Clock,
  Filter,
  Search,
  Grid,
  List
} from 'lucide-react'

const templateItems = [
  {
    id: '1',
    name: 'Template Publicité Standard',
    description: 'Template pour campagnes publicitaires classiques',
    category: 'Advertising',
    type: 'Video',
    difficulty: 'Facile',
    estimatedTime: '20 min',
    uses: 34,
    rating: 4.7,
    tags: ['publicité', 'standard', 'facile'],
    createdAt: '2025-01-10T10:30:00Z',
    author: 'Alice Martin',
    thumbnail: 'https://via.placeholder.com/300x200/6366F1/FFFFFF?text=Template+1'
  },
  {
    id: '2',
    name: 'Template Lancement Produit',
    description: 'Template spécialisé pour les lancements de produits',
    category: 'Product Launch',
    type: 'Audio',
    difficulty: 'Moyen',
    estimatedTime: '35 min',
    uses: 18,
    rating: 4.5,
    tags: ['lancement', 'produit', 'audio'],
    createdAt: '2025-01-08T14:20:00Z',
    author: 'Bob Chen',
    thumbnail: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=Template+2'
  },
  {
    id: '3',
    name: 'Template Écologique',
    description: 'Template pour campagnes axées sur la durabilité',
    category: 'Sustainability',
    type: 'Image',
    difficulty: 'Avancé',
    estimatedTime: '50 min',
    uses: 8,
    rating: 4.9,
    tags: ['écologie', 'durabilité', 'vert'],
    createdAt: '2025-01-05T09:15:00Z',
    author: 'Claire Dubois',
    thumbnail: 'https://via.placeholder.com/300x200/EF4444/FFFFFF?text=Template+3'
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

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'Video':
      return '🎥'
    case 'Audio':
      return '🎵'
    case 'Image':
      return '🖼️'
    default:
      return '📄'
  }
}

export default function MediaTemplatesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Modèles de Médias
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Découvrez et utilisez nos templates de médias prêts à l'emploi
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Créer un Template
        </Button>
      </div>

      {/* Search and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher des templates..."
              className="pl-10 pr-4 py-2 border rounded-md w-80"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {templateItems.length} templates disponibles
        </div>
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
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templateItems.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2">
                  <Badge className={getDifficultyColor(template.difficulty)}>
                    {template.difficulty}
                  </Badge>
                </div>
                <div className="absolute top-2 left-2">
                  <div className="bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                    {getTypeIcon(template.type)} {template.type}
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <CardDescription className="mt-1">
                  {template.description}
                </CardDescription>
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
      ) : (
        <div className="space-y-4">
          {templateItems.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{template.name}</h3>
                      <Badge className={getDifficultyColor(template.difficulty)}>
                        {template.difficulty}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        {getTypeIcon(template.type)} {template.type}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {template.description}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Par {template.author} • {template.uses} utilisations • Note: {template.rating}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {template.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
