#!/bin/bash

# Script d'installation des dépendances - Octobre 2025
echo "🚀 Installation des dépendances AI Ad Maker - Octobre 2025"

# Vérifier que pnpm est installé
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm n'est pas installé. Installation de pnpm..."
    npm install -g pnpm
fi

# Installation des dépendances racine
echo "📦 Installation des dépendances racine..."
pnpm install

# Installation des dépendances pour chaque workspace
echo "📦 Installation des dépendances web..."
cd apps/web && pnpm install && cd ../..

echo "📦 Installation des dépendances API..."
cd apps/api && pnpm install && cd ../..

echo "📦 Installation des dépendances agents..."
cd packages/agents && pnpm install && cd ../..

echo "📦 Installation des dépendances connectors..."
cd packages/connectors && pnpm install && cd ../..

echo "📦 Installation des dépendances shared..."
cd packages/shared && pnpm install && cd ../..

# Vérification des installations
echo "✅ Vérification des installations..."

# Test des imports LangChain
echo "🔍 Test des imports LangChain v1.0..."
node -e "
try {
  require('@langchain/openai');
  require('@langchain/core/prompts');
  require('@langchain/core/messages');
  console.log('✅ LangChain v1.0 imports OK');
} catch (e) {
  console.log('❌ LangChain v1.0 imports failed:', e.message);
}
"

# Test des imports LangGraph
echo "🔍 Test des imports LangGraph v0.4..."
node -e "
try {
  require('langgraph');
  console.log('✅ LangGraph v0.4 imports OK');
} catch (e) {
  console.log('❌ LangGraph v0.4 imports failed:', e.message);
}
"

# Test des imports React 19
echo "🔍 Test des imports React 19..."
node -e "
try {
  require('react');
  require('react-dom');
  console.log('✅ React 19 imports OK');
} catch (e) {
  console.log('❌ React 19 imports failed:', e.message);
}
"

# Test des imports Next.js 15
echo "🔍 Test des imports Next.js 15..."
node -e "
try {
  require('next');
  console.log('✅ Next.js 15 imports OK');
} catch (e) {
  console.log('❌ Next.js 15 imports failed:', e.message);
}
"

# Test des imports Fastify v5
echo "🔍 Test des imports Fastify v5..."
node -e "
try {
  require('fastify');
  console.log('✅ Fastify v5 imports OK');
} catch (e) {
  console.log('❌ Fastify v5 imports failed:', e.message);
}
"

# Test des imports TanStack Query v5
echo "🔍 Test des imports TanStack Query v5..."
node -e "
try {
  require('@tanstack/react-query');
  console.log('✅ TanStack Query v5 imports OK');
} catch (e) {
  console.log('❌ TanStack Query v5 imports failed:', e.message);
}
"

echo "🎉 Installation terminée !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Copier env.example vers .env"
echo "2. Configurer les variables d'environnement"
echo "3. Lancer les tests : pnpm test"
echo "4. Démarrer le développement : pnpm dev"
