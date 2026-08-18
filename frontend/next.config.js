/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.REACT_APP_BACKEND_URL || '',
  },
  outputFileTracingRoot: __dirname,
  allowedDevOrigins: [
    'wedding-samuel.preview.emergentagent.com',
    '*.preview.emergentagent.com',
    'wedding-samuel.cluster-8.preview.emergentcf.cloud',
    '*.preview.emergentcf.cloud',
    '*.cluster-8.preview.emergentcf.cloud',
  ],
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
