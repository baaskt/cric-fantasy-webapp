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
      {
        protocol: 'https',
        hostname: 'makeitmatta.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '91-cdn.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'thefederal.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.icc-cricket.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'assets-icc.sportz.io',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'static.cricbuzz.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'drive.usercontent.google.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'media.cricheroes.in',
        pathname: '**',
      },
    ],
  },
}

module.exports = nextConfig
