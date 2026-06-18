const isProd = process.env.NODE_ENV === 'production'

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    distDir: 'docs',
    // assetPrefix: isProd ? 'https://projects.wyofile.com/election-guide-2026/' : undefined,
    basePath: '/election-guide-2026',
    assetPrefix: '/election-guide-2026',
    trailingSlash: true,
    compiler: {
        emotion: true,
    },
    images: {
        unoptimized: true,
    },
};

export default nextConfig;