'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Mail,
  Phone,
  Calendar,
  Shield,
  Crown,
  User,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'

const teamMembers = [
  {
    id: '1',
    name: 'Alice Martin',
    role: 'Creative Director',
    email: 'alice@ai-ad-maker.com',
    avatar: 'https://via.placeholder.com/60x60/6366F1/FFFFFF?text=AM',
    status: 'active',
    lastActive: '2025-01-15T14:30:00Z',
    projects: 12,
    performance: 98,
    permissions: ['admin', 'create', 'edit', 'delete'],
    joinDate: '2024-01-15'
  },
  {
    id: '2',
    name: 'Bob Chen',
    role: 'AI Specialist',
    email: 'bob@ai-ad-maker.com',
    avatar: 'https://via.placeholder.com/60x60/10B981/FFFFFF?text=BC',
    status: 'active',
    lastActive: '2025-01-15T13:45:00Z',
    projects: 8,
    performance: 95,
    permissions: ['create', 'edit'],
    joinDate: '2024-03-20'
  },
  {
    id: '3',
    name: 'Claire Dubois',
    role: 'Brand Manager',
    email: 'claire@ai-ad-maker.com',
    avatar: 'https://via.placeholder.com/60x60/F59E0B/FFFFFF?text=CD',
    status: 'away',
    lastActive: '2025-01-14T16:20:00Z',
    projects: 6,
    performance: 92,
    permissions: ['create', 'edit'],
    joinDate: '2024-06-10'
  },
  {
    id: '4',
    name: 'David Kim',
    role: 'Developer',
    email: 'david@ai-ad-maker.com',
    avatar: 'https://via.placeholder.com/60x60/EF4444/FFFFFF?text=DK',
    status: 'inactive',
    lastActive: '2025-01-10T09:15:00Z',
    projects: 4,
    performance: 88,
    permissions: ['view'],
    joinDate: '2024-09-05'
  }
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case 'away':
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
    case 'away':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'inactive':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getRoleIcon = (role: string) => {
  if (role.includes('Director') || role.includes('Manager')) {
    return <Crown className="h-4 w-4 text-yellow-500" />
  } else if (role.includes('Admin')) {
    return <Shield className="h-4 w-4 text-blue-500" />
  }
  return <User className="h-4 w-4 text-gray-500" />
}

export default function TeamPage() {
  const [selectedMember, setSelectedMember] = useState<string | null>(null)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Équipe
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Gérez votre équipe et les permissions d'accès
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Inviter un membre
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membres Actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              +1 ce mois-ci
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Moyenne</CardTitle>
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
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">30</div>
            <p className="text-xs text-muted-foreground">
              +5 cette semaine
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrateurs</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              Alice Martin
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Team Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <CardDescription className="text-sm flex items-center gap-1">
                      {getRoleIcon(member.role)}
                      {member.role}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(member.status)}
                  <Badge className={getStatusColor(member.status)}>
                    {member.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {member.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Rejoint le {new Date(member.joinDate).toLocaleDateString('fr-FR')}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <div className="text-2xl font-bold">{member.projects}</div>
                  <div className="text-xs text-muted-foreground">Projets</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{member.performance}%</div>
                  <div className="text-xs text-muted-foreground">Performance</div>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <h4 className="text-sm font-medium mb-2">Permissions</h4>
                <div className="flex flex-wrap gap-1">
                  {member.permissions.map((permission) => (
                    <Badge key={permission} variant="secondary" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" size="sm" className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Contacter
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
