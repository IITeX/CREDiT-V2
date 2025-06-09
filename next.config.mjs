/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Handle WASM files for @dfinity packages
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    }
    
    // Handle .wasm files
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    })

    // Fallback for Node.js modules in browser
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      url: false,
      zlib: false,
      http: false,
      https: false,
      assert: false,
      os: false,
      path: false,
    }

    return config
  },
  
  // Experimental features removed as recommended by Next.js

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  
  // Handle static file serving - CORS headers removed for IC Network compatibility
  async headers() {
    return []
  },
}

export default nextConfig
