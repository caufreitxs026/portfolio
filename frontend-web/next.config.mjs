/** @type {import('next').NextConfig} */
const nextConfig = {
  // Isso ajuda a ignorar erros de download de fontes durante o build na Vercel
  optimizeFonts: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;