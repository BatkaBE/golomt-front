module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:9091/api/:path*' // Backend API
      }
    ]
  }
};
