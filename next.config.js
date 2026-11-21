/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  reactStrictMode: true,
  ...(isGithubPages ? { output: 'export' } : {}),
  basePath: isGithubPages ? '/vayusaathi-smog-copilot' : '',
  images: { unoptimized: true },
};

module.exports = nextConfig;
