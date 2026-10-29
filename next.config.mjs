/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ['three', 'echarts', 'echarts-for-react'],
  webpack: (config) => {
    config.externals = [...(config.externals || [])]
    return config
  },
}

export default nextConfig
