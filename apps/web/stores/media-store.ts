import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface MediaItem {
  id: string
  name: string
  description: string
  type: 'image' | 'video' | 'audio' | 'voice'
  url: string
  thumbnailUrl?: string
  status: 'processing' | 'ready' | 'error' | 'draft'
  fileSize: string
  quality: number
  dimensions?: string
  duration?: string
  createdAt: string
  updatedAt: string
  tags: string[]
  metadata: Record<string, any>
}

interface MediaStore {
  media: MediaItem[]
  selectedMedia: MediaItem | null
  isLoading: boolean
  error: string | null
  
  // Actions
  uploadMedia: (file: File) => Promise<void>
  updateMedia: (id: string, updates: Partial<MediaItem>) => void
  deleteMedia: (id: string) => void
  setSelectedMedia: (id: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useMediaStore = create<MediaStore>()(
  devtools(
    persist(
      (set, get) => ({
        media: [
          {
            id: '1',
            name: 'Nike Air Max - Image 1',
            description: 'Image principale pour la campagne Nike Air Max',
            type: 'image',
            url: 'https://example.com/nike-air-max-1.jpg',
            thumbnailUrl: 'https://example.com/nike-air-max-1-thumb.jpg',
            status: 'ready',
            fileSize: '2.4 MB',
            quality: 9.2,
            dimensions: '1920x1080',
            createdAt: '2025-01-15T10:30:00Z',
            updatedAt: '2025-01-15T10:30:00Z',
            tags: ['nike', 'sport', 'shoes', 'campaign'],
            metadata: { brand: 'Nike', campaign: 'Air Max 2025', generatedBy: 'image-artisan' }
          },
          {
            id: '2',
            name: 'iPhone 15 - Vidéo',
            description: 'Vidéo publicitaire pour l\'iPhone 15',
            type: 'video',
            url: 'https://example.com/iphone-15-video.mp4',
            thumbnailUrl: 'https://example.com/iphone-15-thumb.jpg',
            status: 'ready',
            fileSize: '15.7 MB',
            quality: 9.5,
            dimensions: '1920x1080',
            duration: '00:30',
            createdAt: '2025-01-14T16:30:00Z',
            updatedAt: '2025-01-14T16:30:00Z',
            tags: ['apple', 'iphone', 'tech', 'video'],
            metadata: { brand: 'Apple', campaign: 'iPhone 15 Launch', generatedBy: 'animator' }
          },
          {
            id: '3',
            name: 'Tesla Model Y - Audio',
            description: 'Musique de fond pour la publicité Tesla',
            type: 'audio',
            url: 'https://example.com/tesla-music.mp3',
            status: 'processing',
            fileSize: '4.2 MB',
            quality: 8.8,
            duration: '00:30',
            createdAt: '2025-01-13T15:45:00Z',
            updatedAt: '2025-01-13T15:45:00Z',
            tags: ['tesla', 'electric', 'music', 'background'],
            metadata: { brand: 'Tesla', campaign: 'Model Y 2025', generatedBy: 'music-gen' }
          },
          {
            id: '4',
            name: 'Nike Air Max - Voix Off',
            description: 'Narration pour la publicité Nike',
            type: 'voice',
            url: 'https://example.com/nike-voice.mp3',
            status: 'ready',
            fileSize: '1.8 MB',
            quality: 9.1,
            duration: '00:15',
            createdAt: '2025-01-15T11:00:00Z',
            updatedAt: '2025-01-15T11:00:00Z',
            tags: ['nike', 'voice', 'narration', 'sport'],
            metadata: { brand: 'Nike', campaign: 'Air Max 2025', generatedBy: 'voice-gen' }
          },
          {
            id: '5',
            name: 'iPhone 15 - Image 2',
            description: 'Image secondaire pour l\'iPhone 15',
            type: 'image',
            url: 'https://example.com/iphone-15-2.jpg',
            thumbnailUrl: 'https://example.com/iphone-15-2-thumb.jpg',
            status: 'error',
            fileSize: '3.1 MB',
            quality: 0,
            dimensions: '1920x1080',
            createdAt: '2025-01-14T17:00:00Z',
            updatedAt: '2025-01-14T17:00:00Z',
            tags: ['apple', 'iphone', 'tech', 'error'],
            metadata: { brand: 'Apple', campaign: 'iPhone 15 Launch', generatedBy: 'image-artisan', error: 'Génération échouée' }
          },
          {
            id: '6',
            name: 'Tesla Model Y - Vidéo Draft',
            description: 'Brouillon de vidéo pour Tesla',
            type: 'video',
            url: 'https://example.com/tesla-draft.mp4',
            thumbnailUrl: 'https://example.com/tesla-draft-thumb.jpg',
            status: 'draft',
            fileSize: '8.5 MB',
            quality: 7.2,
            dimensions: '1920x1080',
            duration: '00:45',
            createdAt: '2025-01-13T14:20:00Z',
            updatedAt: '2025-01-13T14:20:00Z',
            tags: ['tesla', 'electric', 'draft', 'video'],
            metadata: { brand: 'Tesla', campaign: 'Model Y 2025', generatedBy: 'animator', status: 'draft' }
          }
        ],
        selectedMedia: null,
        isLoading: false,
        error: null,

        uploadMedia: async (file) => {
          set({ isLoading: true, error: null })
          
          try {
            // Simuler l'upload
            await new Promise(resolve => setTimeout(resolve, 2000))
            
            const newMedia: MediaItem = {
              id: Date.now().toString(),
              name: file.name,
              description: `Fichier uploadé: ${file.name}`,
              type: file.type.startsWith('image/') ? 'image' : 
                    file.type.startsWith('video/') ? 'video' : 
                    file.type.startsWith('audio/') ? 'audio' : 'voice',
              url: URL.createObjectURL(file),
              status: 'processing',
              fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
              quality: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              tags: ['uploaded'],
              metadata: { originalFile: file.name, uploadedBy: 'user' }
            }
            
            set((state) => ({
              media: [...state.media, newMedia],
              isLoading: false
            }))
            
            // Simuler le traitement
            setTimeout(() => {
              set((state) => ({
                media: state.media.map(item =>
                  item.id === newMedia.id
                    ? { ...item, status: 'ready', quality: 8.5, updatedAt: new Date().toISOString() }
                    : item
                )
              }))
            }, 5000)
            
          } catch (error) {
            set({ 
              isLoading: false, 
              error: error instanceof Error ? error.message : 'Erreur lors de l\'upload' 
            })
          }
        },

        updateMedia: (id, updates) => {
          set((state) => ({
            media: state.media.map(item =>
              item.id === id
                ? { ...item, ...updates, updatedAt: new Date().toISOString() }
                : item
            )
          }))
        },

        deleteMedia: (id) => {
          set((state) => ({
            media: state.media.filter(item => item.id !== id),
            selectedMedia: state.selectedMedia?.id === id ? null : state.selectedMedia
          }))
        },

        setSelectedMedia: (id) => {
          const media = id ? get().media.find(m => m.id === id) : null
          set({ selectedMedia: media || null })
        },

        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error })
      }),
      {
        name: 'media-store',
        partialize: (state) => ({
          media: state.media,
          selectedMedia: state.selectedMedia
        })
      }
    ),
    { name: 'MediaStore' }
  )
)
