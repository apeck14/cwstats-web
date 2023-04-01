import ComingSoon from "../../components/ComingSoon"
import { NextSeo } from "next-seo"

export default function PlayerSearch() {
	return <>
		<NextSeo
			title= "Player Search"
			description= "Search for players on CWStats."
			openGraph={{
				url: "https://www.cwstats.com/player/search",
				title: "Player Search",
				description: "Search for players on CWStats."
			}}
		/>

		<ComingSoon />
	</>
}