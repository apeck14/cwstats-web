import { getGuild } from "../../../actions/discord"
import ServerHeaderContent from "./header-content"

export default async function ServerHeader({ id }) {
  const { data: guild } = await getGuild(id, true)

  return <ServerHeaderContent guild={guild} />
}
