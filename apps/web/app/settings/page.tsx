'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Settings, 
  Save, 
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Zap,
  Moon,
  Sun,
  Monitor
} from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Profile
    name: 'Alice Martin',
    email: 'alice@ai-ad-maker.com',
    role: 'Creative Director',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    projectUpdates: true,
    
    // Appearance
    theme: 'system',
    language: 'fr',
    fontSize: 'medium',
    
    // Security
    twoFactorAuth: true,
    sessionTimeout: 30,
    loginAlerts: true,
    
    // AI Settings
    autoGenerate: true,
    qualityLevel: 'high',
    brandCompliance: true,
    creativeMode: 'balanced',
    
    // Integrations
    slackIntegration: true,
    googleDrive: false,
    dropbox: true,
    notion: true
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Paramètres
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Personnalisez votre expérience et configurez vos préférences
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Sauvegarder
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profil
            </CardTitle>
            <CardDescription>
              Informations personnelles et préférences de compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                value={settings.name}
                onChange={(e) => handleSettingChange('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => handleSettingChange('email', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rôle</Label>
              <Input
                id="role"
                value={settings.role}
                onChange={(e) => handleSettingChange('role', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configurez vos préférences de notification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications email</Label>
                <p className="text-sm text-muted-foreground">
                  Recevoir des emails pour les mises à jour importantes
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications push</Label>
                <p className="text-sm text-muted-foreground">
                  Notifications en temps réel dans le navigateur
                </p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Rapports hebdomadaires</Label>
                <p className="text-sm text-muted-foreground">
                  Résumé des performances chaque semaine
                </p>
              </div>
              <Switch
                checked={settings.weeklyReports}
                onCheckedChange={(checked) => handleSettingChange('weeklyReports', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Apparence
            </CardTitle>
            <CardDescription>
              Personnalisez l'interface utilisateur
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Thème</Label>
              <div className="flex gap-2">
                <Button
                  variant={settings.theme === 'light' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSettingChange('theme', 'light')}
                >
                  <Sun className="h-4 w-4 mr-2" />
                  Clair
                </Button>
                <Button
                  variant={settings.theme === 'dark' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSettingChange('theme', 'dark')}
                >
                  <Moon className="h-4 w-4 mr-2" />
                  Sombre
                </Button>
                <Button
                  variant={settings.theme === 'system' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSettingChange('theme', 'system')}
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  Système
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Langue</Label>
              <select
                id="language"
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Sécurité
            </CardTitle>
            <CardDescription>
              Paramètres de sécurité et authentification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Authentification à deux facteurs</Label>
                <p className="text-sm text-muted-foreground">
                  Protection supplémentaire pour votre compte
                </p>
              </div>
              <Switch
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeout">Délai d'expiration de session (minutes)</Label>
              <Input
                id="timeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Alertes de connexion</Label>
                <p className="text-sm text-muted-foreground">
                  Notifications pour les nouvelles connexions
                </p>
              </div>
              <Switch
                checked={settings.loginAlerts}
                onCheckedChange={(checked) => handleSettingChange('loginAlerts', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* AI Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              IA
            </CardTitle>
            <CardDescription>
              Configuration des agents IA et génération automatique
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Génération automatique</Label>
                <p className="text-sm text-muted-foreground">
                  L'IA peut créer du contenu automatiquement
                </p>
              </div>
              <Switch
                checked={settings.autoGenerate}
                onCheckedChange={(checked) => handleSettingChange('autoGenerate', checked)}
              />
            </div>
            <div className="space-y-2">
              <Label>Niveau de qualité</Label>
              <select
                value={settings.qualityLevel}
                onChange={(e) => handleSettingChange('qualityLevel', e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="low">Rapide</option>
                <option value="medium">Équilibré</option>
                <option value="high">Haute qualité</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Conformité aux marques</Label>
                <p className="text-sm text-muted-foreground">
                  Respecter automatiquement les guidelines
                </p>
              </div>
              <Switch
                checked={settings.brandCompliance}
                onCheckedChange={(checked) => handleSettingChange('brandCompliance', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Intégrations
            </CardTitle>
            <CardDescription>
              Connectez vos outils et services préférés
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Slack</Label>
                <p className="text-sm text-muted-foreground">
                  Notifications et partage de contenu
                </p>
              </div>
              <Switch
                checked={settings.slackIntegration}
                onCheckedChange={(checked) => handleSettingChange('slackIntegration', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Google Drive</Label>
                <p className="text-sm text-muted-foreground">
                  Sauvegarde et synchronisation
                </p>
              </div>
              <Switch
                checked={settings.googleDrive}
                onCheckedChange={(checked) => handleSettingChange('googleDrive', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dropbox</Label>
                <p className="text-sm text-muted-foreground">
                  Stockage et partage de fichiers
                </p>
              </div>
              <Switch
                checked={settings.dropbox}
                onCheckedChange={(checked) => handleSettingChange('dropbox', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notion</Label>
                <p className="text-sm text-muted-foreground">
                  Documentation et collaboration
                </p>
              </div>
              <Switch
                checked={settings.notion}
                onCheckedChange={(checked) => handleSettingChange('notion', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
