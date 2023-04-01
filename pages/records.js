import { NextSeo } from "next-seo"
import ComingSoon from "../components/ComingSoon"

export default function Records() {
	return <>
		<NextSeo
			title= "CW2 Records"
			description= "Matchmaking is currently underway for the specified clan. Check back soon."
			openGraph={{
				url: "https://www.cwstats.com/records",
				title: "CW2 Records",
				description: "Matchmaking is currently underway for the specified clan. Check back soon."
			}}
		/>
		<ComingSoon />
	</>
}