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
  redirects: async () => [
    {
      destination:
        "https://discord.com/oauth2/authorize?client_id=869761158763143218&permissions=2147797184&scope=bot+applications.commands",
      permanent: true,
      source: "/invite",
    },
  ],
  swcMinify: true,
}
