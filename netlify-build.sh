#!/bin/bash

# Script de build optimisé pour Netlify
# Évite les erreurs de configuration Next.js

echo "🚀 Starting AI Ad Maker build for Netlify..."

# Désactiver la télémétrie Next.js
export NEXT_TELEMETRY_DISABLED=1

# Configuration pour éviter les erreurs
export NODE_ENV=production

# Installer les dépendances
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# Build du package shared d'abord
echo "🔧 Building shared package..."
pnpm --filter @ai-ad-maker/shared run build

# Build de l'application web
echo "🏗️ Building web application..."
pnpm --filter @ai-ad-maker/web run build:netlify

echo "✅ Build completed successfully!"
