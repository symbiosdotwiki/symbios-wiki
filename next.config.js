/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  reactStrictMode: true,
  // distDir: 'build',
  exportPathMap: function() {
    return {
      "/symbios-wiki": {page: "/"}
    }
  },
  assetPrefix: isProd ? '/your-github-repo-name/' : '',
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
};
