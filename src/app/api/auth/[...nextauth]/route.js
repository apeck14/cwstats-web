import { MongoDBAdapter } from "@auth/mongodb-adapter"
import { ObjectId } from "mongodb"
import NextAuth from "next-auth/next"
import DiscordProvider from "next-auth/providers/discord"
import { Logger } from "next-axiom"

import client from "@/lib/mongodb"

function createRandomState(length = 32) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let state = ""
  for (let i = 0; i < length; i++) {
    state += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return state
}

async function refreshAccessToken(token) {
  try {
    const url = "https://discord.com/api/oauth2/token"

    const body = new URLSearchParams({
      client_id: process.env.DISCORD_ID,
      client_secret: process.env.DISCORD_SECRET,
      grant_type: "refresh_token",
      refresh_token: token.refreshToken,
    })

    const response = await fetch(url, {
      body: body.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      expiresAt: Date.now() + refreshedTokens.expires_in * 1000,
      providerId: refreshedTokens.providerAccountId,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token if not provided
    }
  } catch (err) {
    const log = new Logger()
    log.error(err)

    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

const scope = ["identify", "guilds", "guilds.members.read"].join(" ")

export const authOptions = {
  adapter: MongoDBAdapter(client),
  callbacks: {
    jwt: async ({ account, token, user }) => {
      // On initial sign-in, set the access and refresh tokens
      if (account && user) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = Date.now() + account.expires_at
        token.providerId = account.providerAccountId
      }

      if (Date.now() < token.expiresAt) {
        return token
      }

      // expired
      return refreshAccessToken(token)
    },
    session: async ({ session, token }) => {
      if (token) {
        session.accessToken = token.accessToken
        session.refreshToken = token.refreshToken
        session.expiresAt = token.expiresAt
        session.providerId = token.providerId
      }
      return session
    },
    signIn: async ({ profile, user }) => {
      try {
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
        log.error("signIn Error", e)

        return false
      }
    },
  },
  cookies: {
    state: {
      name: createRandomState(),
      options: {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  debug: process.env.NODE_ENV !== "production",
  providers: [
    DiscordProvider({
      authorization: {
        params: {
          scope,
        },
      },
      check: ["none"],
      clientId: process.env.DISCORD_ID,
      clientSecret: process.env.DISCORD_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  theme: { logo: "https://www.cwstats.com/_next/image?url=%2Fassets%2Ficons%2Flogo.webp&w=96&q=100" },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
