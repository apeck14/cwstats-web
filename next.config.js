const headers = require("./headers")

module.exports = {
    reactStrictMode: false,
    compiler: {
        styledComponents: true,
    },
    images: {
        domains: ["cdn.discordapp.com", "imgur.com"],
    },
    headers: async () => {
        return [
            {
                source: "/(.*)",
                headers,
            },
        ]
    },
}
