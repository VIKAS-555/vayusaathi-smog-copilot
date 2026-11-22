/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  reactStrictMode: true,
  ...(isGithubPages ? { output: 'export' } : {}),
  basePath: isGithubPages ? '/vayusaathi-smog-copilot' : '',
  images: { unoptimized: true },
  ...(!isGithubPages
    ? {
        async rewrites() {
          return [
            {
              source: '/vayusaathi-smog-copilot',
              destination: '/',
            },
            {
              source: '/vayusaathi-smog-copilot/:path*',
              destination: '/:path*',
            },
          ];
        },
      }
    : {}),
};

module.exports = nextConfig;

