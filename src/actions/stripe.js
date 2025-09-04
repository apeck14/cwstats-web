/* eslint-disable import/prefer-default-export */

"use server"

import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const getStripeSession = async (sessionId) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const subscription = await stripe.subscriptions.retrieve(session.subscription)

    const guildId = subscription?.metadata?.guildId

    if (guildId) {
      return { url: `/me/servers/${guildId}/clans` }
    }

    return { url: "/404_" }
  } catch {
    return { url: "/404_" }
  }
}
