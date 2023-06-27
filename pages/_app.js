import "../styles/globals.css"

import { Source_Sans_3 } from "next/font/google"
import Head from "next/head"
import { useRouter } from "next/router"
import Script from "next/script"
import { SessionProvider } from "next-auth/react"
import { DefaultSeo } from "next-seo"
import { useEffect } from "react"
import styled from "styled-components"

import Footer from "../components/Footer"
import Navbar from "../components/Navbar/index"
import usePageLoading from "../hooks/usePageLoading"
import { pageview } from "../lib/gtag"
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

  // Google Analytics
  useEffect(() => {
    const handleRouteChange = (url) => {
      pageview(url)
    }
    router.events.on("routeChangeComplete", handleRouteChange)
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [router.events])

  return (
    <SessionProvider session={session}>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
          key="viewport"
        />
      </Head>

      {/* Google Analytics */}
      <Script
        async
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', ${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID}, {
            page_path: window.location.pathname,
          });
        `,
        }}
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
