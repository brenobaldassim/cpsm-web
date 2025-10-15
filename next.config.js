/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  webpack: (config, { isServer }) => {
    // Exclude problematic files from being parsed by webpack
    config.module.rules.push({
      test: /\.html$/,
      type: "asset/resource",
      generator: {
        filename: "static/[hash][ext]",
      },
    })

    // Externalize optional and mock dependencies
    config.externals = [
      ...(config.externals || []),
      "mock-aws-s3",
      "nock",
      "aws-sdk",
    ]

    // Exclude native modules and pre-gyp from client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      }
    }

    return config
  },
}

module.exports = nextConfig
