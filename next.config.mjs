/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  images: {
    disableStaticImages: true, // Deshabilita la optimización de imágenes
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.postimg.cc",
        pathname: "/**",
      },
    ],
    domains: [
      "localhost",
      "dreamplace.com.ar",
      "https://dreamplace-production.up.railway.app/",
      "i.postimg.cc",
      "res.cloudinary.com",
    ],
  },
  output: "standalone",
};

export default nextConfig;
