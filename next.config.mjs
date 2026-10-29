/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Fixes: Vercel Lambda bundling of Three.js and ECharts
  // These are large browser-only libs — mark them as external for server builds
  experimental: {
    serverComponentsExternalPackages: ['three', 'echarts', 'echarts-for-react'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Prevent Three.js from being bundled in the server build at all
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        'three',
        'echarts',
        'echarts-for-react',
      ]
    }
    return config
  },
}

export default nextConfig
