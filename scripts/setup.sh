#!/bin/bash

# AI Ad Maker - Setup Script
# Ce script configure l'environnement de développement complet

set -e

echo "🚀 AI Ad Maker - Setup Script"
echo "=============================="

# Vérifier les prérequis
echo "📋 Vérification des prérequis..."

# Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js 20+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js version 20+ requise. Version actuelle: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v)"

# pnpm
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installation de pnpm..."
    npm install -g pnpm
fi

echo "✅ pnpm $(pnpm -v)"

# PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL n'est pas installé. Veuillez installer PostgreSQL 16+"
    echo "   macOS: brew install postgresql@16"
    echo "   Ubuntu: sudo apt install postgresql-16"
    exit 1
fi

echo "✅ PostgreSQL $(psql --version)"

# Redis
if ! command -v redis-server &> /dev/null; then
    echo "❌ Redis n'est pas installé. Veuillez installer Redis 6+"
    echo "   macOS: brew install redis"
    echo "   Ubuntu: sudo apt install redis-server"
    exit 1
fi

echo "✅ Redis $(redis-server --version | head -n1)"

echo ""
echo "🔧 Configuration de l'environnement..."

# Copier le fichier d'environnement
if [ ! -f .env ]; then
    echo "📝 Copie du fichier d'environnement..."
    cp env.example .env
    echo "⚠️  Veuillez configurer vos clés API dans .env"
else
    echo "✅ Fichier .env déjà présent"
fi

# Installer les dépendances
echo "📦 Installation des dépendances..."
pnpm install

# Setup de la base de données
echo "🗄️  Configuration de la base de données..."

# Démarrer PostgreSQL si nécessaire
if ! pg_isready -q; then
    echo "🔄 Démarrage de PostgreSQL..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew services start postgresql@16
    else
        sudo systemctl start postgresql
    fi
fi

# Créer la base de données
echo "📊 Création de la base de données..."
createdb ai_ad_maker 2>/dev/null || echo "Base de données déjà existante"

# Générer le client Prisma
echo "🔧 Génération du client Prisma..."
pnpm db:generate

# Pousser le schéma
echo "📋 Application du schéma de base de données..."
pnpm db:push

# Démarrer Redis si nécessaire
echo "🔄 Vérification de Redis..."
if ! redis-cli ping &> /dev/null; then
    echo "🔄 Démarrage de Redis..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew services start redis
    else
        sudo systemctl start redis
    fi
fi

echo ""
echo "🎉 Configuration terminée !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Configurez vos clés API dans .env"
echo "2. Démarrez l'application : pnpm dev"
echo "3. Ouvrez http://localhost:3000"
echo ""
echo "🔗 Liens utiles :"
echo "• Interface web : http://localhost:3000"
echo "• API : http://localhost:3001"
echo "• Prisma Studio : pnpm db:studio"
echo "• Documentation : docs/HOW-TO-PUBLISH-AD.md"
echo ""
echo "🚀 Bon développement avec AI Ad Maker !"
