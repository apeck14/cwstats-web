import { headers as getHeaders } from "next/headers"

import { getClan } from "../../../actions/supercell"
import ClanHeader from "../../../components/clan/header"
import { getTagFromHeaders } from "../../../lib/functions"

export default async function ClanPage() {
  const headers = getHeaders()
  const tag = getTagFromHeaders(headers)
  const clan = await getClan(tag)

  return <ClanHeader clan={clan.data} url={headers.get("x-url")} />
}
