import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import { ObjectId } from "mongodb"
import NextAuth from "next-auth/next"
import DiscordProvider from "next-auth/providers/discord"
import { Logger } from "next-axiom"

import clientPromise from "../../../../lib/mongodb"

const scope = ["identify", "guilds", "guilds.members.read"].join(" ")

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user) session.user.id = user.id

      const client = await clientPromise
      const db = client.db("General")
      const accounts = db.collection("accounts")

      const userId = new ObjectId(user.id)

      const account = await accounts.findOne({ userId })

      // if session expired
      if (account.expires_at * 1000 < Date.now()) {
        try {
          // refresh token
          const response = await fetch(`https://discord.com/api/oauth2/token`, {
            body: new URLSearchParams({
              client_id: process.env.DISCORD_ID,
              client_secret: process.env.DISCORD_SECRET,
              grant_type: "refresh_token",
              refresh_token: account.refresh_token,
            }),
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            method: "POST",
          })
          const tokens = await response.json()

          if (!response.ok) throw tokens

          await accounts.updateOne(account, {
            $set: {
              access_token: tokens.access_token,
              expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in),
              refresh_token: tokens.refresh_token ?? account.refresh_token,
            },
          })
        } catch (err) {
          const log = new Logger()
          log.warn("session error (refreshing access token)", err)

          // used client-side
          session.error = "RefreshAccessTokenError"
        }
      }

      return session
    },
    signIn: async ({ profile, user }) => {
      try {
        const client = await clientPromise
        const db = client.db("General")
        const linkedAccounts = db.collection("Linked Accounts")
        const users = db.collection("users")

        const userExists = await linkedAccounts.findOne({
          discordID: profile.id,
        })

        if (userExists) {
          // user.id is not discord ID, meaning not a new user (update image)
          if (!/^\d+$/.test(user.id)) {
            users.updateOne({ _id: new ObjectId(user.id) }, { $set: { image: profile.image_url } })
          }
        } else {
          // if user doesn't exist in DB (aka never used /link before) then create user
          linkedAccounts.insertOne({
            discordID: profile.id,
            savedClans: [],
            savedPlayers: [],
            tag: null,
          })
        }

        return true
      } catch (e) {
        const log = new Logger()
        log.info(user)
        log.error("signIn Error", e)

        return false
      }
    },
  },
  providers: [
    DiscordProvider({
      authorization: {
        params: {
          scope,
        },
      },
      checks: ["none"],
      clientId: process.env.DISCORD_ID,
      clientSecret: process.env.DISCORD_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
