/**
 * Configuration de build pour Netlify
 * Optimisations pour le déploiement
 */

module.exports = {
  // Configuration pour éviter les erreurs de build
  experimental: {
    // Désactiver les fonctionnalités expérimentales qui causent des erreurs
    reactCompiler: false,
    turbo: false,
  },
  
  // Configuration pour les performances
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  
  // Configuration pour les images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Configuration webpack pour éviter les erreurs
  webpack: (config, { isServer }) => {
    // Optimisations pour les performances
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
        process: false,
      }
    }
    
    return config
  },
  
  // Configuration pour les redirections
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/',
        permanent: true,
      },
    ]
  },
  
  // Configuration pour les headers
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ]
  },
}
