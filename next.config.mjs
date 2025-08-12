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
      {
        protocol: "https",
        hostname: "dreamplace.com.ar",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "https://dreamplace-production.up.railway.app/",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  output: "standalone",
  // reactStrictMode: false,
};

export default nextConfig;
