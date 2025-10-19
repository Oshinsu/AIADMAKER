'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react'

const brands = [
  {
    id: '1',
    name: 'Nike',
    description: 'Just Do It - Innovation et performance',
    status: 'active',
    logo: 'https://via.placeholder.com/60x60/000000/FFFFFF?text=N',
    guidelines: {
      colors: ['#000000', '#FFFFFF', '#FF0000'],
      fonts: ['Helvetica', 'Arial'],
      tone: 'Motivational, Bold, Inspiring'
    },
    lastUsed: '2025-01-15T10:30:00Z',
    projects: 12,
    compliance: 98
  },
  {
    id: '2',
    name: 'Apple',
    description: 'Think Different - Simplicité et élégance',
    status: 'active',
    logo: 'https://via.placeholder.com/60x60/007AFF/FFFFFF?text=A',
    guidelines: {
      colors: ['#007AFF', '#FFFFFF', '#000000'],
      fonts: ['SF Pro Display', 'Helvetica'],
      tone: 'Clean, Minimalist, Premium'
    },
    lastUsed: '2025-01-14T16:45:00Z',
    projects: 8,
    compliance: 95
  },
  {
    id: '3',
    name: 'Tesla',
    description: 'Accelerating the world\'s transition to sustainable transport',
    status: 'pending',
    logo: 'https://via.placeholder.com/60x60/CC0000/FFFFFF?text=T',
    guidelines: {
      colors: ['#CC0000', '#FFFFFF', '#000000'],
      fonts: ['Gotham', 'Arial'],
      tone: 'Innovative, Sustainable, Futuristic'
    },
    lastUsed: '2025-01-13T09:20:00Z',
    projects: 5,
    compliance: 87
  }
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-500" />
    case 'inactive':
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    default:
      return <Clock className="h-4 w-4 text-gray-500" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'inactive':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

export default function BrandsPage() {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Gestion des Marques
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Gérez vos guidelines de marque et assurez la cohérence de vos créations
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle Marque
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marques Actives</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              +1 depuis le mois dernier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conformité Moyenne</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">93%</div>
            <p className="text-xs text-muted-foreground">
              +2% depuis le mois dernier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projets Actifs</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground">
              +5 depuis la semaine dernière
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Templates</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">
              +3 cette semaine
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Brands List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => (
          <Card key={brand.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img 
                    src={brand.logo} 
                    alt={brand.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <CardTitle className="text-lg">{brand.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {brand.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(brand.status)}
                  <Badge className={getStatusColor(brand.status)}>
                    {brand.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Guidelines */}
              <div>
                <h4 className="text-sm font-medium mb-2">Guidelines</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: brand.guidelines.colors[0] }} />
                    <span className="text-xs text-muted-foreground">
                      {brand.guidelines.colors.join(', ')}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <strong>Fonts:</strong> {brand.guidelines.fonts.join(', ')}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <strong>Tone:</strong> {brand.guidelines.tone}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <div className="text-2xl font-bold">{brand.projects}</div>
                  <div className="text-xs text-muted-foreground">Projets</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{brand.compliance}%</div>
                  <div className="text-xs text-muted-foreground">Conformité</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  Voir
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
