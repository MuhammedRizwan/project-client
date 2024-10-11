/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',  // Google profile images domain
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'res.cloudinary.com',  // Cloudinary domain
            pathname: '/**',
          },
         
        ],
      },
};

export default nextConfig;
