const headers = require("./headers")

module.exports = {
  compiler: {
    styledComponents: true,
  },
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
    domains: ["cdn.discordapp.com", "imgur.com"],
  },
  poweredByHeader: false,
  reactStrictMode: false,
  swcMinify: true,
}
