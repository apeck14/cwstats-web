"use server"

/* eslint-disable import/prefer-default-export */
import { headers } from "next/headers"

const HOST = process.env.NEXTAUTH_URL

export async function getLinkedAccount() {
  const options = { headers: headers(), next: { revalidate: 600, tags: ["linked-account"] } }
  const linkedAccount = await fetch(`${HOST}/api/user`, options)

  return linkedAccount.json()
}

export async function getPlayerByQuery() {
  return 1
}
