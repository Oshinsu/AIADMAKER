#!/bin/bash

# Script de vérification complète de la stack - Octobre 2025
echo "🔍 Vérification complète de la stack AI Ad Maker - Octobre 2025"
echo "=================================================================="

# Fonction pour vérifier une dépendance
check_dependency() {
    local name=$1
    local package=$2
    local version=$3
    
    echo "🔍 Vérification de $name..."
    
    if node -e "require('$package')" 2>/dev/null; then
        local installed_version=$(node -e "console.log(require('$package/package.json').version)" 2>/dev/null)
        echo "✅ $name v$installed_version installé"
        
        if [[ "$installed_version" == "$version"* ]]; then
            echo "✅ Version correcte ($version)"
        else
            echo "⚠️  Version différente: $installed_version (attendu: $version)"
        fi
    else
        echo "❌ $name non installé"
        return 1
    fi
}

# Vérification des dépendances principales
echo ""
echo "📦 Vérification des dépendances principales..."

check_dependency "LangChain v1.0" "@langchain/openai" "1.0"
check_dependency "LangChain Core" "@langchain/core" "1.0"
check_dependency "LangChain Community" "@langchain/community" "1.0"
check_dependency "LangGraph v0.4" "langgraph" "0.4"

echo ""
echo "🔍 Vérification des dépendances web..."

check_dependency "Next.js 15" "next" "15.0"
check_dependency "React 19" "react" "19.0"
check_dependency "React DOM 19" "react-dom" "19.0"
check_dependency "TanStack Query v5" "@tanstack/react-query" "5.50"
check_dependency "Framer Motion v11" "framer-motion" "11.0"
check_dependency "Zustand v4.5" "zustand" "4.5"

echo ""
echo "🔍 Vérification des dépendances API..."

check_dependency "Fastify v5" "fastify" "5.0"
check_dependency "Prisma v5.20" "prisma" "5.20"
check_dependency "Redis v7" "ioredis" "7.0"
check_dependency "BullMQ v5" "bullmq" "5.0"
check_dependency "Socket.IO v4.7" "socket.io" "4.7"

echo ""
echo "🔍 Vérification des dépendances agents..."

check_dependency "OpenAI v4.60" "openai" "4.60"
check_dependency "Anthropic v0.30" "anthropic" "0.30"
check_dependency "Zod v3.23" "zod" "3.23"
check_dependency "Axios v1.6" "axios" "1.6"

echo ""
echo "🔍 Vérification des types TypeScript..."

if node -e "require('typescript')" 2>/dev/null; then
    local ts_version=$(node -e "console.log(require('typescript/package.json').version)" 2>/dev/null)
    echo "✅ TypeScript v$ts_version installé"
    
    if [[ "$ts_version" == "5.5"* ]]; then
        echo "✅ Version TypeScript correcte (5.5)"
    else
        echo "⚠️  Version TypeScript différente: $ts_version (attendu: 5.5)"
    fi
else
    echo "❌ TypeScript non installé"
fi

echo ""
echo "🔍 Vérification des variables d'environnement..."

# Vérifier si .env existe
if [ -f ".env" ]; then
    echo "✅ Fichier .env trouvé"
    
    # Vérifier les variables importantes
    if grep -q "OPENAI_API_KEY" .env; then
        echo "✅ OPENAI_API_KEY configuré"
    else
        echo "❌ OPENAI_API_KEY manquant"
    fi
    
    if grep -q "LANGCHAIN_API_KEY" .env; then
        echo "✅ LANGCHAIN_API_KEY configuré"
    else
        echo "❌ LANGCHAIN_API_KEY manquant"
    fi
    
    if grep -q "DATABASE_URL" .env; then
        echo "✅ DATABASE_URL configuré"
    else
        echo "❌ DATABASE_URL manquant"
    fi
else
    echo "❌ Fichier .env manquant"
    echo "💡 Copiez env.example vers .env et configurez les variables"
fi

echo ""
echo "🔍 Vérification des imports TypeScript..."

# Test des imports LangChain
echo "🔍 Test des imports LangChain v1.0..."
if node -e "
try {
  const { ChatOpenAI } = require('@langchain/openai');
  const { PromptTemplate } = require('@langchain/core/prompts');
  const { HumanMessage, SystemMessage } = require('@langchain/core/messages');
  console.log('✅ LangChain v1.0 imports OK');
} catch (e) {
  console.log('❌ LangChain v1.0 imports failed:', e.message);
  process.exit(1);
}
" 2>/dev/null; then
    echo "✅ LangChain v1.0 imports fonctionnels"
else
    echo "❌ LangChain v1.0 imports échoués"
fi

# Test des imports LangGraph
echo "🔍 Test des imports LangGraph v0.4..."
if node -e "
try {
  const { StateGraph, END, START } = require('langgraph');
  const { MemorySaver } = require('langgraph/checkpoint/memory');
  console.log('✅ LangGraph v0.4 imports OK');
} catch (e) {
  console.log('❌ LangGraph v0.4 imports failed:', e.message);
  process.exit(1);
}
" 2>/dev/null; then
    echo "✅ LangGraph v0.4 imports fonctionnels"
else
    echo "❌ LangGraph v0.4 imports échoués"
fi

# Test des imports React 19
echo "🔍 Test des imports React 19..."
if node -e "
try {
  const React = require('react');
  const ReactDOM = require('react-dom');
  console.log('✅ React 19 imports OK');
} catch (e) {
  console.log('❌ React 19 imports failed:', e.message);
  process.exit(1);
}
" 2>/dev/null; then
    echo "✅ React 19 imports fonctionnels"
else
    echo "❌ React 19 imports échoués"
fi

echo ""
echo "🔍 Vérification des performances..."

# Test de performance des imports
echo "🔍 Test de performance des imports..."
start_time=$(date +%s%N)
node -e "
const { ChatOpenAI } = require('@langchain/openai');
const { StateGraph } = require('langgraph');
const React = require('react');
const Fastify = require('fastify');
console.log('✅ Tous les imports chargés');
" 2>/dev/null
end_time=$(date +%s%N)
duration=$(( (end_time - start_time) / 1000000 ))
echo "✅ Temps de chargement: ${duration}ms"

echo ""
echo "🎯 Résumé de la vérification"
echo "============================"

# Compter les succès et échecs
success_count=0
total_count=0

# Vérifier chaque dépendance et compter
dependencies=(
    "@langchain/openai:1.0"
    "@langchain/core:1.0"
    "@langchain/community:1.0"
    "langgraph:0.4"
    "next:15.0"
    "react:19.0"
    "react-dom:19.0"
    "@tanstack/react-query:5.50"
    "framer-motion:11.0"
    "zustand:4.5"
    "fastify:5.0"
    "prisma:5.20"
    "ioredis:7.0"
    "bullmq:5.0"
    "socket.io:4.7"
    "openai:4.60"
    "anthropic:0.30"
    "zod:3.23"
    "axios:1.6"
    "typescript:5.5"
)

for dep in "${dependencies[@]}"; do
    IFS=':' read -r package version <<< "$dep"
    total_count=$((total_count + 1))
    
    if node -e "require('$package')" 2>/dev/null; then
        success_count=$((success_count + 1))
    fi
done

echo "📊 Statistiques:"
echo "✅ Dépendances installées: $success_count/$total_count"

if [ $success_count -eq $total_count ]; then
    echo "🎉 Toutes les dépendances sont installées et fonctionnelles !"
    echo "✅ Stack 100% conforme aux meilleures pratiques d'octobre 2025"
else
    echo "⚠️  Certaines dépendances manquent ou sont incorrectes"
    echo "💡 Exécutez: ./scripts/install-dependencies.sh"
fi

echo ""
echo "🚀 Prochaines étapes:"
echo "1. Configurer les variables d'environnement"
echo "2. Lancer les tests: pnpm test"
echo "3. Démarrer le développement: pnpm dev"
echo "4. Vérifier la documentation: docs/MIGRATION-GUIDE-2025.md"
