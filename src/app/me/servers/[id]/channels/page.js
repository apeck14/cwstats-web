import ServerHeader from "@/components/me/header"
import ComingSoon from "@/components/ui/coming-soon"

export default function ChannelsPage({ params }) {
  return (
    <>
      <ServerHeader id={params.id} />
      <ComingSoon />
    </>
  )
}
