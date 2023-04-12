import clientPromise from "../lib/mongodb"

const locations = require("../public/static/locations")

export async function getServerSideProps({ res }) {
  const baseUrl = {
    development: "http://localhost:3000",
    production: "https://cwstats.com",
  }[process.env.NODE_ENV]

  const includedPages = ["/", "/bot/docs", "/bot/setup"]

  // add all leaderboards
  for (const l of locations) {
    includedPages.push(`/leaderboard/daily/${l.key}`)
    includedPages.push(`/leaderboard/war/${l.key}`)
  }

  // add all clans
  const client = await clientPromise
  const db = client.db("General")
  const clans = db.collection("Clans")

  const allClans = await clans.find({}).toArray()

  for (const c of allClans) {
    includedPages.push(`/clan/${c.tag.substring(1)}`)
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${includedPages
        .slice(50000) // max urls per sitemap
        .map(
          (url) => `
            <url>
              <loc>${baseUrl}${url}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>monthly</changefreq>
              <priority>1.0</priority>
            </url>
          `
        )
        .join("")}
    </urlset>
  `

  res.setHeader("Content-Type", "text/xml")
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default function Sitemap() {}
