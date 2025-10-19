// Constantes de l'application
export const APP_NAME = 'AI Ad Maker'
export const APP_VERSION = '1.0.0'
export const APP_DESCRIPTION = 'Agence Marketing IA SOTA 2025 - Automatisation complète de création publicitaire'

// Constantes d'API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
export const API_TIMEOUT = 30000
export const API_RETRY_ATTEMPTS = 3

// Constantes de statuts
export const WORKFLOW_STATUSES = {
  PENDING: 'pending',
  RUNNING: 'running',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
} as const

export const AGENT_STATUSES = {
  ACTIVE: 'active',
  IDLE: 'idle',
  ERROR: 'error',
  MAINTENANCE: 'maintenance'
} as const

export const MEDIA_STATUSES = {
  PROCESSING: 'processing',
  READY: 'ready',
  ERROR: 'error',
  DRAFT: 'draft'
} as const

// Constantes de priorités
export const PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
} as const

// Constantes de types
export const MEDIA_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  VOICE: 'voice'
} as const

export const AGENT_TYPES = {
  GENERATOR: 'generator',
  EVALUATOR: 'evaluator',
  TRANSFORMER: 'transformer',
  VALIDATOR: 'validator'
} as const

// Constantes de limites
export const LIMITS = {
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_VIDEO_SIZE: 500 * 1024 * 1024, // 500MB
  MAX_AUDIO_SIZE: 50 * 1024 * 1024, // 50MB
  MAX_WORKFLOWS_PER_USER: 100,
  MAX_AGENTS_PER_WORKFLOW: 20,
  MAX_STEPS_PER_WORKFLOW: 50
} as const

// Constantes de formats
export const SUPPORTED_IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg']
export const SUPPORTED_VIDEO_FORMATS = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm']
export const SUPPORTED_AUDIO_FORMATS = ['mp3', 'wav', 'aac', 'ogg', 'flac', 'm4a']

// Constantes de qualité
export const QUALITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  SOTA: 'sota'
} as const

export const QUALITY_SCORES = {
  MINIMUM: 6.0,
  GOOD: 7.5,
  EXCELLENT: 9.0,
  PERFECT: 10.0
} as const

// Constantes de temps
export const TIME_CONSTANTS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000
} as const

// Constantes de retry
export const RETRY_CONFIG = {
  MAX_ATTEMPTS: 3,
  INITIAL_DELAY: 1000,
  MAX_DELAY: 30000,
  BACKOFF_MULTIPLIER: 2
} as const

// Constantes de cache
export const CACHE_KEYS = {
  WORKFLOWS: 'workflows',
  AGENTS: 'agents',
  MEDIA: 'media',
  ANALYTICS: 'analytics',
  USER_PREFERENCES: 'user_preferences'
} as const

export const CACHE_TTL = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 2 * 60 * 60 * 1000, // 2 hours
  VERY_LONG: 24 * 60 * 60 * 1000 // 24 hours
} as const

// Constantes d'erreurs
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR'
} as const

export const ERROR_MESSAGES = {
  INVALID_INPUT: 'Données d\'entrée invalides',
  UNAUTHORIZED: 'Non autorisé',
  FORBIDDEN: 'Accès interdit',
  NOT_FOUND: 'Ressource non trouvée',
  RATE_LIMITED: 'Trop de requêtes',
  INTERNAL_ERROR: 'Erreur interne du serveur',
  EXTERNAL_API_ERROR: 'Erreur de l\'API externe',
  TIMEOUT: 'Délai d\'attente dépassé'
} as const

// Constantes de notifications
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
} as const

export const NOTIFICATION_DURATIONS = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 10000
} as const

// Constantes de thèmes
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
} as const

// Constantes de langues
export const LANGUAGES = {
  FR: 'fr',
  EN: 'en',
  ES: 'es',
  DE: 'de'
} as const

// Constantes de régions
export const REGIONS = {
  EU: 'eu',
  US: 'us',
  ASIA: 'asia',
  GLOBAL: 'global'
} as const

// Constantes de sécurité
export const SECURITY = {
  JWT_EXPIRES_IN: '7d',
  REFRESH_TOKEN_EXPIRES_IN: '30d',
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000 // 15 minutes
} as const

// Constantes de monitoring
export const METRICS = {
  WORKFLOW_EXECUTION_TIME: 'workflow_execution_time',
  AGENT_RESPONSE_TIME: 'agent_response_time',
  API_RESPONSE_TIME: 'api_response_time',
  ERROR_RATE: 'error_rate',
  SUCCESS_RATE: 'success_rate',
  THROUGHPUT: 'throughput'
} as const

// Constantes de logs
export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
  TRACE: 'trace'
} as const

export const LOG_CATEGORIES = {
  API: 'api',
  WORKFLOW: 'workflow',
  AGENT: 'agent',
  MEDIA: 'media',
  AUTH: 'auth',
  SYSTEM: 'system'
} as const
