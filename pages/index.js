import { NextSeo } from "next-seo"

import Header from "../components/Home/Header"
import Saved from "../components/Home/Saved"

export default function Home() {
  return (
    <>
      <NextSeo
        openGraph={{
          title: "CWStats - Clash Royale Clan Wars Analytics, Leaderboards, Stats & more!",
        }}
        title="CWStats - Clash Royale Clan Wars Analytics, Leaderboards, Stats & more!"
      />

      <Header />
      <Saved />
    </>
  )
}
