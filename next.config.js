const { withAxiom } = require("next-axiom")
const headers = require("./headers")

module.exports = withAxiom({
  experimental: {
    optimizePackageImports: ["@tabler/icons-react", "@mantine/core", "@mantine/hooks"],
  },
  headers: async () => [
    {
      headers,
      source: "/(.*)",
    },
  ],
  images: {
    remotePatterns: [
      { hostname: "cdn.discord.app.com", protocol: "https" },
      { hostname: "cdn.discordapp.com", protocol: "https" },
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
    {
      destination: "https://discord.gg/fFY3cnMmnH",
      permanent: true,
      source: "/support",
    },
  ],
  swcMinify: true,
})
