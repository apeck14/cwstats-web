import '../styles/globals.css'
import Navbar from "../components/Navbar/index.js"
import styled from "styled-components"
import { SessionProvider } from "next-auth/react"
import Footer from '../components/Footer'
import Head from 'next/head'
import { gray } from '../public/static/colors'
import { useRouter } from 'next/router'

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
			<Head>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width"
					key="viewport"
				/>
				<meta name="theme-color" content={gray["75"]} />
			</Head>
			<Container>
				<Navbar />
				<Component {...pageProps} key={router.asPath} />
				<Footer />
			</Container>
		</SessionProvider>
	)
}