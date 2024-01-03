import { headers as getHeaders } from "next/headers"

import { getClan } from "../../../../actions/supercell"
import ClanHeader from "../../../../components/clan/header"
import { getTagFromHeaders, getTagFromURL } from "../../../../lib/functions"

export default async function ClanRace() {
  const headers = getHeaders()
  const tag = getTagFromHeaders(headers)
  console.log(tag)
  // const clan = await getClan()

  return <ClanHeader clan={{}} />
}
