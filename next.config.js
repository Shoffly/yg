/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig

// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/send-notification',
        destination: 'https://ns-wiws.onrender.com/send-notification',
      },
    ]
  },
}