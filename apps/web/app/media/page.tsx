'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Image, 
  Video, 
  Music, 
  Mic, 
  Upload, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Filter,
  Search,
  Grid,
  List,
  Plus
} from 'lucide-react'
import { useMediaStore } from '@/stores/media-store'

export default function MediaPage() {
  const { media, uploadMedia, deleteMedia, updateMedia } = useMediaStore()

  const mediaIcons = {
    image: Image,
    video: Video,
    audio: Music,
    voice: Mic
  }

  const mediaStatus = {
    processing: { color: 'bg-yellow-500', text: 'Traitement' },
    ready: { color: 'bg-green-500', text: 'Prêt' },
    error: { color: 'bg-red-500', text: 'Erreur' },
    draft: { color: 'bg-gray-500', text: 'Brouillon' }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Média</h1>
          <p className="text-muted-foreground">
            Gérez vos assets créatifs : images, vidéos, audio
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Rechercher
          </Button>
          <Button variant="outline" size="sm">
            <Grid className="h-4 w-4 mr-2" />
            Grille
          </Button>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{media.length}</div>
            <p className="text-xs text-muted-foreground">
              +12 cette semaine
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Images</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {media.filter(m => m.type === 'image').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Assets visuels
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vidéos</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {media.filter(m => m.type === 'video').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Contenu vidéo
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Audio</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {media.filter(m => m.type === 'audio').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Fichiers audio
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {media.map((item) => {
          const Icon = mediaIcons[item.type as keyof typeof mediaIcons] || Image
          const statusInfo = mediaStatus[item.status as keyof typeof mediaStatus]
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 group">
                <CardHeader className="p-0">
                  <div className="relative aspect-video bg-muted rounded-t-lg overflow-hidden">
                    {item.type === 'image' ? (
                      <img 
                        src={item.thumbnailUrl || item.url} 
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : item.type === 'video' ? (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                        <Video className="h-12 w-12 text-white" />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-500 to-blue-600">
                        <Icon className="h-12 w-12 text-white" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      <Badge className={`${statusInfo.color} text-white`}>
                        {statusInfo.text}
                      </Badge>
                    </div>
                    
                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                      <Button size="sm" variant="secondary">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold truncate">{item.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {item.description}
                    </p>
                    
                    {/* Metadata */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{item.type.toUpperCase()}</span>
                      <span>{item.fileSize}</span>
                    </div>
                    
                    {/* Quality & Dimensions */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Qualité: {item.quality}/10</span>
                      {item.dimensions && (
                        <span className="text-muted-foreground">{item.dimensions}</span>
                      )}
                    </div>
                    
                    {/* Created Date */}
                    <div className="text-xs text-muted-foreground">
                      Créé le {item.createdAt}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Upload Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload de fichiers</h3>
            <p className="text-muted-foreground text-center mb-4">
              Glissez-déposez vos fichiers ici ou cliquez pour sélectionner
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Sélectionner des fichiers
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Formats supportés: JPG, PNG, MP4, MP3, WAV
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
