/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com', 'youtube.com', 'img.youtube.com', 'res.cloudinary.com'],
  },
  transpilePackages: ['undici'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        http: false,
        https: false,
        stream: false,
        crypto: false,
      };
    }
    // Ignorar undici completamente
    config.externals = [...(config.externals || []), 'undici'];
    return config;
  },
};

module.exports = nextConfig;
