import ComingSoon from "../../components/ComingSoon"
import { NextSeo } from "next-seo"

export default function PlayerSearch() {
	return <>
		<NextSeo
			title= "Player Search"
			description= "Search for players on CWStats."
			openGraph={{
				title: "Player Search",
				description: "Search for players on CWStats."
			}}
		/>

		<ComingSoon />
	</>
}