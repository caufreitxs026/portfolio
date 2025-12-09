/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Permite imagens de qualquer domínio (como Supabase/Placehold)
      },
    ],
  },
};

export default nextConfig;
