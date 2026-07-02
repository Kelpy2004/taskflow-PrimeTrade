import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin the tracing root to this repo (a stray lockfile exists in the user directory).
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
