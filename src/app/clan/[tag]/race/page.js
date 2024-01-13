import { headers as getHeaders } from "next/headers"

import { getClan } from "../../../../actions/supercell"
import ClanHeader from "../../../../components/clan/header"
import { getTagFromHeaders } from "../../../../lib/functions"

export default async function ClanRace() {
  const headers = getHeaders()
  const tag = getTagFromHeaders(headers)
  const { data: clan } = await getClan(tag)

  return <ClanHeader clan={clan} />
}
