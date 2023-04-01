import { NextSeo } from "next-seo"
import ComingSoon from "../../components/ComingSoon"

export default function BotSetup() {
	return <>
		<NextSeo
			title= "Setup - CWStats"
			description= "Manage your CWStats Discord servers."
			openGraph={{
				title: "Setup - CWStats",
				description: "Manage your CWStats Discord servers."
			}}
		/>
		<ComingSoon />
	</>
}