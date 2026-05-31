import { withNextVideo } from "next-video/process";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "images.unsplash.com",
    ],
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.devtool = false // ou 'source-map' se preferir
    }
    return config
  },
};

export default withNextVideo(nextConfig);
