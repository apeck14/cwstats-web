import { MongoDBAdapter } from "@auth/mongodb-adapter"
import NextAuth from "next-auth/next"
import DiscordProvider from "next-auth/providers/discord"
import { Logger } from "next-axiom"

import client from "@/lib/mongodb"

// Constants
const DISCORD_API = {
  ME: "https://discord.com/api/users/@me",
  REVOKE: "https://discord.com/api/oauth2/token/revoke",
  TOKEN: "https://discord.com/api/oauth2/token",
}

const REQUIRED_SCOPES = ["identify", "guilds", "guilds.members.read"]

export const SessionErrors = {
  EXPIRED_ACCESS_TOKEN: "ExpiredAccessTokenError",
  INVALID_DISCORD_TOKEN: "InvalidDiscordTokenError",
  REFRESH_TOKEN_ERROR: "RefreshAccessTokenError",
  REVOKED_ACCESS: "RevokedAccessError",
}

export async function discordRequest(url, options) {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...options.headers,
      },
      ...options,
    })

    const data = await response.json()

    if (!response.ok) {
      return { error: data.error, success: false }
    }

    return { data, success: true }
  } catch (error) {
    const log = new Logger()
    log.error(`Discord API error: ${url}`, error)
    return { error, success: false }
  }
}

export async function validateDiscordToken(accessToken) {
  if (!accessToken) return { isValid: false }

  const { success } = await discordRequest(DISCORD_API.ME, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!success) {
    return { error: SessionErrors.INVALID_DISCORD_TOKEN, isValid: false }
  }

  return { isValid: true }
}

export async function revokeAccessToken(accessToken, discordId) {
  if (!accessToken) return { success: false }

  const body = new URLSearchParams({
    client_id: process.env.DISCORD_ID,
    client_secret: process.env.DISCORD_SECRET,
    token: accessToken,
  })

  const { success } = await discordRequest(DISCORD_API.REVOKE, {
    body,
    method: "POST",
  })

  if (!success) {
    return { error: SessionErrors.REVOKED_ACCESS, success: false }
  }

  // remove from DB
  const db = client.db("General")
  const accounts = db.collection("accounts")
  const users = db.collection("users")

  accounts.deleteMany({ providerAccountId: discordId })
  users.deleteMany({
    image: { $regex: discordId },
  })

  return { success: true }
}

export async function refreshAccessToken(session) {
  const body = new URLSearchParams({
    client_id: process.env.DISCORD_ID,
    client_secret: process.env.DISCORD_SECRET,
    grant_type: "refresh_token",
    refresh_token: session.user.refresh_token,
  })

  const { data, error, success } = await discordRequest(DISCORD_API.TOKEN, {
    body,
    method: "POST",
  })

  if (!success) {
    return {
      ...session,
      error: error === "invalid_grant" ? SessionErrors.REVOKED_ACCESS : SessionErrors.REFRESH_TOKEN_ERROR,
    }
  }

  // Update database with new token data
  const db = client.db("General")
  const accounts = db.collection("accounts")

  await accounts.updateOne(
    { providerAccountId: session.user.discord_id },
    {
      $set: {
        access_token: data.access_token,
        expires_at: Date.now() + data.expires_in * 1000,
        refresh_token: data.refresh_token ?? session.user.refresh_token,
      },
    },
  )

  return {
    ...session,
    access_token: data.access_token,
    error: null,
    expires_at: Date.now() + data.expires_in * 1000,
    refresh_token: data.refresh_token ?? session.user.refresh_token,
  }
}

const REFRESH_THRESHOLD = 5 * 60 * 1000 // 5 minutes

// NextAuth Configuration
export const authOptions = {
  adapter: MongoDBAdapter(client),
  callbacks: {
    /*
    JWT called:
      - on sign in
      - on session check (useSession, getServerSession)right before session callback
      - token refresh
     */
    jwt: async ({ account, profile, token }) => {
      if (account && profile) {
        const image = profile.avatar
          ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
          : `https://cdn.discordapp.com/embed/avatars/${parseInt(profile.discriminator) % 5}.png`

        return {
          ...token,
          user: {
            access_token: account.access_token,
            discord_id: profile.id,
            expires_at: account.expires_at * 1000,
            image,
            name: profile.username,
            refresh_token: account.refresh_token,
          },
        }
      }

      const timeUntilExpiration = token?.user?.expires_at - Date.now()

      // less than 5 mins until expiration
      if (timeUntilExpiration < REFRESH_THRESHOLD) {
        // Refresh the access token using the refresh token (make sure this logic is handled)
        try {
          // Attempt to refresh the token
          const refreshedToken = await refreshAccessToken(token)

          return {
            ...token,
            user: {
              ...token.user,
              access_token: refreshedToken.access_token,
              access_token_expires: refreshedToken.expires_at * 1000,
            },
          }
        } catch {
          token.error = SessionErrors.REFRESH_TOKEN_ERROR
          return token
        }
      }

      return token
    },
    /*
    session called:
      - getSession, useSession, getServerSession
     */
    session: async ({ session, token }) => {
      try {
        const db = client.db("General")
        const linkedAccounts = db.collection("Linked Accounts")

        const [{ isValid }, linkedAccount] = await Promise.all([
          validateDiscordToken(token.user.access_token),
          linkedAccounts.findOne(
            {
              discordID: token.user.discord_id,
            },
            { projection: { _id: 0, savedClans: 1, savedPlayers: 1, tag: 1 } },
          ),
        ])

        if (!isValid) {
          token = await refreshAccessToken(token)

          if (token.error) {
            // If the refresh fails, handle gracefully
            return {
              ...session,
              ...token,
              ...linkedAccount,
              error: SessionErrors.REFRESH_TOKEN_ERROR,
            }
          }
        }

        session = {
          user: {
            ...session.user,
            ...token.user,
          },
          ...linkedAccount,
        }

        return session
      } catch {
        session.error = SessionErrors.REFRESH_TOKEN_ERROR
        return session
      }
    },
    signIn: async ({ profile }) => {
      try {
        const db = client.db("General")
        const linkedAccounts = db.collection("Linked Accounts")

        const userExists = await linkedAccounts.findOne({
          discordID: profile.id,
        })

        if (!userExists) {
          // Create new user
          await linkedAccounts.insertOne({
            discordID: profile.id,
            savedClans: [],
            savedPlayers: [],
            tag: null,
          })
        }

        return true
      } catch (error) {
        const log = new Logger()
        log.error("Database operation error:", error)
        return false
      }
    },
  },
  debug: process.env.NODE_ENV !== "production",
  events: {
    async signOut({ token }) {
      revokeAccessToken(token.user.access_token, token.user.discord_id)
    },
  },
  providers: [
    DiscordProvider({
      authorization: {
        params: {
          scope: REQUIRED_SCOPES.join(" "),
        },
      },
      check: ["none"],
      clientId: process.env.DISCORD_ID,
      clientSecret: process.env.DISCORD_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    strategy: "jwt",
  },
  theme: {
    logo: "https://www.cwstats.com/_next/image?url=%2Fassets%2Ficons%2Flogo.webp&w=96&q=100",
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
