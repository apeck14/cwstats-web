const { withAxiom } = require("next-axiom")
const headers = require("./headers")

module.exports = withAxiom({
  reactStrictMode: false,
  poweredByHeader: false,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ["cdn.discordapp.com", "imgur.com"],
  },
  i18n: {
    defaultLocale: "en-US",
    locales: ["en-US"],
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers,
    },
  ],
})
