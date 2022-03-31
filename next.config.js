/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  // async rewrites() {
  //   return {
  //     beforeFiles: [
  //       // These rewrites are checked after headers/redirects
  //       // and before all files including _next/public files which
  //       // allows overriding page files
  //       {
  //         source: '/:path*',
  //         destination: '/',
  //       },
  //     ],
  //   }
  // },
  reactStrictMode: true,
  // images: {
  //   loader: 'akamai',
  //   path: '',
  // },
  // distDir: 'build',
  // exportPathMap: function() {
  //   if(isProd){
  //     return {
  //       "/symbios-wiki": {page: "/"}
  //     }
  //   }
  //   return {}
  // },
  // assetPrefix: isProd ? '/symbios-wiki/' : '',
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
};
