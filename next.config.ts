import type { NextConfig } from "next";
import path from "path";

const isGithubActions = process.env.GITHUB_ACTIONS || false;

// ✨ GITHUB PAGES ✨
const repoName = "DnTApp";

const basePath = isGithubActions ? `/${repoName}` : "";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  turbopack: {
    root: path.resolve(__dirname),
  },
  basePath: basePath,
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
  /* 
  // Rewrites are not supported in static export (output: 'export')
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/classic/index.html',
      },
      {
        source: '/classic',
        destination: '/classic/index.html',
      },
    ];
  }, 
  */
};

export default nextConfig;
