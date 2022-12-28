/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                hostname: 'cdn.shopify.com',
                protocol: 'https',
                port: '',
                pathname: '/**',
            },
        ],
    },
}

module.exports = nextConfig
