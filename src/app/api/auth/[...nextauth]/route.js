import { MongoDBAdapter } from "@auth/mongodb-adapter"
import NextAuth from "next-auth/next"
import DiscordProvider from "next-auth/providers/discord"
import { Logger } from "next-axiom"

import client from "@/lib/mongodb"

export async function discordRequest(url, options) {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.status}`)
    }

    return { data: await response.json(), success: true }
  } catch (error) {
    const log = new Logger()
    log.error(`Discord API error: ${url}`, error)
    return { error, success: false }
  }
}

// Constants
const DISCORD_API = {
  ME: "https://discord.com/api/users/@me",
  REVOKE: "https://discord.com/api/oauth2/token/revoke",
  TOKEN: "https://discord.com/api/oauth2/token",
}

const REQUIRED_SCOPES = ["identify", "guilds", "guilds.members.read"]

const SessionErrors = {
  EXPIRED_ACCESS_TOKEN: "ExpiredAccessTokenError",
  INVALID_DISCORD_TOKEN: "InvalidDiscordTokenError",
  REFRESH_TOKEN_ERROR: "RefreshAccessTokenError",
  REVOKED_ACCESS: "RevokedAccessError",
}

const ErrorMessages = {
  [SessionErrors.INVALID_DISCORD_TOKEN]: {
    code: "INVALID_TOKEN",
    message: "Invalid Discord token",
    recoverable: true,
  },
  [SessionErrors.REFRESH_TOKEN_ERROR]: {
    code: "TOKEN_REFRESH_ERROR",
    message: "Failed to refresh access token",
    recoverable: true,
  },
  [SessionErrors.REVOKED_ACCESS]: {
    code: "ACCESS_REVOKED",
    message: "Discord access has been revoked",
    recoverable: false,
  },
  UNKNOWN: {
    code: "UNKNOWN_ERROR",
    message: "An unknown error occurred",
    recoverable: true,
  },
}

async function validateDiscordToken(accessToken) {
  const { success } = await discordRequest(DISCORD_API.ME, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!success) {
    return { error: SessionErrors.INVALID_DISCORD_TOKEN, isValid: false }
  }

  return { isValid: true }
}

async function refreshAccessToken(token) {
  const body = new URLSearchParams({
    client_id: process.env.DISCORD_ID,
    client_secret: process.env.DISCORD_SECRET,
    grant_type: "refresh_token",
    refresh_token: token.user.refreshToken,
  })

  const { data, error, success } = await discordRequest(DISCORD_API.TOKEN, {
    body,
    method: "POST",
  })

  if (!success) {
    return {
      ...token,
      error: error?.error === "invalid_grant" ? SessionErrors.REVOKED_ACCESS : SessionErrors.REFRESH_TOKEN_ERROR,
    }
  }

  return {
    ...token,
    accessToken: data.access_token,
    accessTokenExpires: Date.now() + data.expires_in * 1000,
    error: null,
    refreshToken: data.refresh_token ?? token.user.refreshToken,
  }
}

async function revokeDiscordToken(token) {
  const body = new URLSearchParams({
    client_id: process.env.DISCORD_ID,
    client_secret: process.env.DISCORD_SECRET,
    token,
  })

  const { success } = await discordRequest(DISCORD_API.REVOKE, {
    body,
    method: "POST",
  })

  return success
}

// Database Operations
async function handleUserData(profile) {
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
}

const REFRESH_THRESHOLD = 5 * 60 * 1000 // 5 minutes

// NextAuth Configuration
export const authOptions = {
  adapter: MongoDBAdapter(client),
  callbacks: {
    jwt: async ({ account, profile, token, user }) => {
      // initial sign-in
      if (account && profile) {
        const image = profile.avatar
          ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
          : `https://cdn.discordapp.com/embed/avatars/${parseInt(profile.discriminator) % 5}.png`

        return {
          user: {
            ...token,
            accessToken: account.access_token,
            accessTokenExpires: account.expires_at * 1000,
            discordId: profile.id,
            id: user.id,
            image, // Set image here
            name: profile.username,
            refreshToken: account.refresh_token,
          },
        }
      }

      const timeUntilExpiration = token?.user?.accessTokenExpires - Date.now()

      // Refresh token if it's within threshold time
      if (timeUntilExpiration < REFRESH_THRESHOLD) {
        return refreshAccessToken(token)
      }

      return token
    },
    session: async ({ session, token }) => {
      // Handle token errors
      if (token.error) {
        session.error = ErrorMessages[token.error] || ErrorMessages.UNKNOWN

        if (token.error === SessionErrors.REVOKED_ACCESS) {
          throw new Error("Discord access revoked")
        }
      }

      // Validate token if present
      if (token.accessToken && !token.error) {
        const { error, isValid } = await validateDiscordToken(token.accessToken)
        if (!isValid) {
          session.error = {
            code: error,
            message: "Session validation failed",
            recoverable: true,
          }
        }
      }

      // Update session
      session.user = {
        ...session.user,
        ...token.user,
      }

      return session
    },
    signIn: ({ profile }) => handleUserData(profile),
  },
  debug: process.env.NODE_ENV !== "production",
  events: {
    signOut: async ({ session }) => {
      if (session?.accessToken) {
        await revokeDiscordToken(session.accessToken)
      }
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
