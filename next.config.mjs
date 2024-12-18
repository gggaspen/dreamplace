/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ],
  },
  output: "standalone",
};

export default nextConfig;
