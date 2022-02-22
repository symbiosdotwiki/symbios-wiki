/** @type {import('next').NextConfig} */


module.exports = {
  reactStrictMode: true,
  exportPathMap: function() {
    return {
      "/symbios-wiki": {page: "/"}
    }
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
};
