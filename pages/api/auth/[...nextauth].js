import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import NextAuth from "next-auth/next"
import DiscordProvider from "next-auth/providers/discord"

import clientPromise from "../../../lib/mongodb"

const scope = ["identify guilds"].join(" ")

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
    session: ({ session, user }) => {
      if (session?.user) session.user.id = user.id

      return session
    },
  },
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
