const { withAxiom } = require("next-axiom")
const headers = require("./headers")

module.exports = withAxiom({
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },
  headers: async () => [
    {
      headers,
      source: "/(.*)",
    },
    {
      headers: [
        { key: "Access-Control-Allow-Credentials", value: "true" },
        { key: "Access-Control-Allow-Origin", value: "*" },
        {
          key: "Access-Control-Allow-Methods",
          value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
        },
        {
          key: "Access-Control-Allow-Headers",
          value:
            "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
        },
      ],
      // matching all API routes
      source: "/api/(.*)",
    },
  ],
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
    {
      destination: "https://discord.gg/fFY3cnMmnH",
      permanent: true,
      source: "/support",
    },
    {
      destination: "https://www.paypal.com/paypalme/cw2stats",
      permanent: true,
      source: "/donate",
    },
  ],
  swcMinify: true,
})
