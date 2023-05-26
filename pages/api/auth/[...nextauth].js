import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import NextAuth from "next-auth/next"
import DiscordProvider from "next-auth/providers/discord"

import clientPromise from "../../../lib/mongodb"

const scope = ["identify guilds guilds.members.read"].join(" ")

export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_ID,
      clientSecret: process.env.DISCORD_SECRET,
      authorization: {
        params: {
          scope,
        },
      },
    }),
  ],
  callbacks: {
    signIn: async ({ user }) => {
      // if user doesn't exist in DB (aka never used /link before) then create user
      try {
        const client = await clientPromise
        const db = client.db("General")
        const linkedAccounts = db.collection("Linked Accounts")

        const userExists = await linkedAccounts.findOne({
          discordID: user.id,
        })

        if (!userExists) {
          linkedAccounts.insertOne({
            discordID: user.id,
            tag: null,
            savedClans: [],
            savedPlayers: [],
          })
        }

        return true
      } catch (e) {
        console.log(e)

        return false
      }
    },
    session: async ({ session, user }) => {
      // eslint-disable-next-line global-require
      const { ObjectId } = require("mongodb")

      if (session?.user) session.user.id = user.id

      const client = await clientPromise
      const db = client.db("General")
      const accounts = db.collection("accounts")

      const userId = new ObjectId(user.id)

      const account = await accounts.findOne({ userId })

      if (account.expires_at * 1000 < Date.now()) {
        try {
          // refresh token
          const response = await fetch(`https://discord.com/api/oauth2/token`, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: process.env.DISCORD_ID,
              client_secret: process.env.DISCORD_SECRET,
              grant_type: "refresh_token",
              refresh_token: account.refresh_token,
            }),
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
          console.error("Error refreshing access token", err)

          // used client-side
          session.error = "RefreshAccessTokenError"
        }
      }

      return session
    },
  },
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
