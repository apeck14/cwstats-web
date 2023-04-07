import { NextSeo } from "next-seo"
import ComingSoon from "../../components/ComingSoon"

export default function PlayerSearch() {
    return (
        <>
            <NextSeo
                title="Player Search"
                description="Search for players on CWStats."
                openGraph={{
                    title: "Player Search",
                    description: "Search for players on CWStats.",
                }}
            />

            <ComingSoon />
        </>
    )
}
