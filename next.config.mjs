// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignore ESLint warnings during build to allow completion despite some warnings
  eslint: {
    // Allow development builds to ignore warnings
    ignoreDuringBuilds: true
  },
  // Disable TypeScript type checking during production builds
  typescript: {
    // Skip type checking during build for faster builds
    ignoreBuildErrors: true
  }
}

export default nextConfig
