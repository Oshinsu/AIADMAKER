'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Music, 
  Upload, 
  Download,
  Edit,
  Trash2,
  Eye,
  Filter,
  Search,
  Grid,
  List,
  Play,
  Volume2
} from 'lucide-react'

const audioItems = [
  {
    id: '1',
    name: 'Nike Air Max Jingle',
    type: 'audio',
    url: 'https://via.placeholder.com/300x200/6366F1/FFFFFF?text=Audio',
    size: '3.2 MB',
    duration: '0:15',
    format: 'MP3',
    createdAt: '2025-01-15T10:30:00Z',
    tags: ['nike', 'jingle', 'music'],
    status: 'ready'
  },
  {
    id: '2',
    name: 'Apple iPhone 15 Pro Sound',
    type: 'audio',
    url: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=Audio',
    size: '5.8 MB',
    duration: '0:30',
    format: 'WAV',
    createdAt: '2025-01-14T16:45:00Z',
    tags: ['apple', 'sound', 'demo'],
    status: 'processing'
  },
  {
    id: '3',
    name: 'Tesla Model Y Engine Sound',
    type: 'audio',
    url: 'https://via.placeholder.com/300x200/EF4444/FFFFFF?text=Audio',
    size: '7.1 MB',
    duration: '1:00',
    format: 'MP3',
    createdAt: '2025-01-13T09:20:00Z',
    tags: ['tesla', 'engine', 'sound'],
    status: 'ready'
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ready':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'processing':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'error':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

export default function AudioPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Audio
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Gérez votre bibliothèque audio et contenus sonores
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Télécharger
          </Button>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher des fichiers audio..."
              className="pl-10 pr-4 py-2 border rounded-md w-80"
            />
          </div>
          <div className="flex items-center gap-2">
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
          {audioItems.length} fichiers audio • {selectedItems.length} sélectionnés
        </div>
      </div>

      {/* Media Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {audioItems.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <div className="relative">
                <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-t-lg flex items-center justify-center">
                  <Volume2 className="h-12 w-12 text-gray-400" />
                </div>
                <div className="absolute top-2 right-2">
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </div>
                <div className="absolute top-2 left-2">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems([...selectedItems, item.id])
                      } else {
                        setSelectedItems(selectedItems.filter(id => id !== item.id))
                      }
                    }}
                    className="w-4 h-4"
                  />
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                  {item.duration}
                </div>
              </div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-medium truncate">{item.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{item.format}</span>
                    <span>•</span>
                    <span>{item.size}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Play className="h-4 w-4 mr-2" />
                      Écouter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {audioItems.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                    <Volume2 className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{item.name}</h3>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {item.format} • {item.duration} • {item.size} • {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
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
