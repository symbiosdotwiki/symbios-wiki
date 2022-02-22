/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rules : [
    {
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    }
  ]
}

module.exports = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
};
