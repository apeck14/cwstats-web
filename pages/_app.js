import { Analytics } from "@vercel/analytics/react"
import { SessionProvider } from "next-auth/react"
import { DefaultSeo } from "next-seo"
import Head from "next/head"
import { useRouter } from "next/router"
import styled from "styled-components"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar/index.js"
import { gray } from "../public/static/colors"
import "../styles/globals.css"

const Container = styled.div({
    fontFamily: "SansPro600",
    display: "flex",
    minHeight: "100vh",
    flexDirection: "column",
})

export default function App({
    Component,
    pageProps: { session, ...pageProps },
}) {
    const router = useRouter()

    return (
        <SessionProvider session={session}>
            <Analytics />
            <Head>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                    key="viewport"
                />
            </Head>
            <Container>
                <DefaultSeo
                    title="CWStats"
                    description="The trusted source for everything Clan Wars. Explore advanced statistics, leaderboards and projections while you climb the ranks."
                    themeColor={gray["75"]}
                    openGraph={{
                        type: "website",
                        url: `https://www.cwstats.com${router.asPath}`,
                        siteName: "CWStats",
                        title: "CWStats",
                        description:
                            "The trusted source for everything Clan Wars. Explore advanced statistics, leaderboards and projections while you climb the ranks.",
                        images: [
                            {
                                url: "/assets/icons/logo.png",
                                alt: "CWStats Logo",
                            },
                        ],
                    }}
                />
                <Navbar />
                <Component {...pageProps} key={router.asPath} />
                <Footer />
            </Container>
        </SessionProvider>
    )
}
