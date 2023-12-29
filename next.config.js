const headers = require("./headers")

module.exports = {
  headers: async () => [
    {
      headers,
      source: "/(.*)",
    },
  ],
  i18n: {
    defaultLocale: "en-US",
    locales: ["en-US"],
  },
  images: {
    remotePatterns: [
      { hostname: "cdn.discord.app", protocol: "https" },
      { hostname: "imgur.com", protocol: "https" },
    ],
  },
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
}
