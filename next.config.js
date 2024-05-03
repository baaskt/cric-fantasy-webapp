/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'i.cricketcb.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'bcciplayerimages.s3.ap-south-1.amazonaws.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'gallery.chennaisuperkings.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'api.bdcrictime.com',
        pathname: '**',
      },
    ],
  },
}

module.exports = nextConfig
