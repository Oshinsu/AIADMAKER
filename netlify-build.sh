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
cd packages/shared && pnpm build && cd ../..

# Build de l'application web
echo "🏗️ Building web application..."
cd apps/web && pnpm build:netlify && cd ../..

echo "✅ Build completed successfully!"
