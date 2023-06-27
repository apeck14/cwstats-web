import "../styles/globals.css"

import { Source_Sans_3 } from "next/font/google"
import Head from "next/head"
import { useRouter } from "next/router"
import { SessionProvider } from "next-auth/react"
import { DefaultSeo } from "next-seo"
import { GoogleAnalytics } from "nextjs-google-analytics"
import styled from "styled-components"

import Footer from "../components/Footer"
import Navbar from "../components/Navbar/index"
import usePageLoading from "../hooks/usePageLoading"
import { gray } from "../public/static/colors"

const SourceSans3 = Source_Sans_3({ subsets: ["latin"] })

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const Content = styled.div`
  margin: 0 auto;
  width: 70rem;

  @media (max-width: 1200px) {
    width: 80%;
  }

  @media (max-width: 1024px) {
    width: 100%;
  }
`

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter()
  const { isPageLoading } = usePageLoading()

  return (
    <SessionProvider session={session}>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
          key="viewport"
        />
      </Head>

      <GoogleAnalytics
        gaMeasurementId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID}
        trackPageViews
      />

      <Container className={SourceSans3.className}>
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
        <Content>
          <Component {...pageProps} key={router.asPath} isLoading={isPageLoading} />
        </Content>
        <Footer />
      </Container>
    </SessionProvider>
  )
}
