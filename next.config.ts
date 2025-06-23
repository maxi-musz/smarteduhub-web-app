import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // You can add other config options here
  reactStrictMode: true,

  webpack(config) {
    // Ensure that the SVGR loader is applied to SVG files
    // when they are imported in JavaScript or TypeScript files.
    // This allows you to use SVGs as React components.

    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: [{ loader: "@svgr/webpack", options: { icon: true } }],
    });

    return config;
  },
};

export default nextConfig;
