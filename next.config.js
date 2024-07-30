/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
      },

      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
      },
    ],
  },

  async redirects() {
    return [
      {
        source: "/channels",
        destination: "/",
        permanent: true,
      },
      {
        source: "/channels/dms",
        destination: "/",
        permanent: true,
      },
      {
        source: "/channels/servers",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
