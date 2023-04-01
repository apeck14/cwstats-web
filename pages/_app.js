import '../styles/globals.css'
import Navbar from "../components/Navbar/index.js"
import styled from "styled-components"
import { SessionProvider } from "next-auth/react"
import Footer from '../components/Footer'
import Head from 'next/head'
import { gray } from '../public/static/colors'
import { useRouter } from 'next/router'
import { Analytics } from "@vercel/analytics/react"
import { DefaultSeo } from 'next-seo'

const Container = styled.div({
	fontFamily: "SansPro600",
	display: "flex",
	minHeight: "100vh",
	flexDirection: "column"
})

export default function App({ Component, pageProps: { session, ...pageProps } }) {
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
					description= "The trusted source for everything Clan Wars. Explore advanced statistics, leaderboards and projections while you climb the ranks."
					themeColor={gray["75"]}
					openGraph={{
						type: "website",
						url: `https://www.cwstats.com${router.asPath}`,
						siteName: "CWStats",
						description: "The trusted source for everything Clan Wars. Explore advanced statistics, leaderboards and projections while you climb the ranks.",
						images: [
							{
								url: "/assets/icons/logo.png",
								alt: "CWStats Logo"
							}
						]
					}}
				/>
				<Navbar />
				<Component {...pageProps} key={router.asPath} />
				<Footer />
			</Container>
		</SessionProvider>
	)
}