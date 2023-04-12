import { NextSeo } from "next-seo"

import ComingSoon from "../../components/ComingSoon"

export default function BotDocs() {
    return (
        <>
            <NextSeo
                title="Documentation - CWStats"
                description="Learn how to set up and use the CWStats Discord bot."
                openGraph={{
                    title: "Documentation - CWStats",
                    description:
                        "Learn how to set up and use the CWStats Discord bot.",
                }}
            />
            <ComingSoon />
        </>
    )
}
